import React, { createContext, useContext, useState, useEffect } from 'react';
import { CognitoUserPool, CognitoUser, AuthenticationDetails, CognitoUserSession } from 'amazon-cognito-identity-js';
import { jwtDecode } from 'jwt-decode';

const poolData = {
  UserPoolId: 'ap-south-2_f75Z7kbEH',
  ClientId: '6evdb5tpam1cja99q1p7vqe8le'
};

const userPool = new CognitoUserPool(poolData);

export interface PrajnaUser {
  facultyId: string;
  role: string;
  campusId: string[];
  campus: string[];
  departmentId: string;
  department: string;
  idToken: string;
}

interface AuthContextType {
  user: PrajnaUser | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Normalization rules as defined in UI-HANDOFF.md §3
const normalizeRole = (roleGroup: string): string => {
  const normalized = roleGroup.toUpperCase();
  if (normalized === 'PVC') return 'PROVC';
  return normalized;
};

const normalizeDepartment = (dept: string | undefined): { id: string, name: string } => {
  if (!dept) return { id: 'CSE', name: 'Computer Science' };
  const upper = dept.toUpperCase();
  if (upper.includes('CSE') || upper.includes('COMPUTER SCIENCE')) return { id: 'CSE', name: 'Computer Science' };
  if (upper.includes('ECE') || upper.includes('ELECTRONICS')) return { id: 'ECE', name: 'Electronics & Communication' };
  if (upper.includes('ME') || upper.includes('MECHANICAL')) return { id: 'ME', name: 'Mechanical Engineering' };
  return { id: upper, name: dept }; // anything else: uppercased ID, as-is name
};

const getCampusName = (code: string): string => {
  if (code === 'BENGALURU') return 'Bengaluru Campus';
  if (code === 'VIZAG') return 'Vizag Campus';
  if (code === 'HYDERABAD') return 'Hyderabad Campus';
  return code;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<PrajnaUser | null>(null);
  const [loading, setLoading] = useState(true);

  const processSession = (session: CognitoUserSession) => {
    const idToken = session.getIdToken().getJwtToken();
    const payload: any = jwtDecode(idToken);

    // Fallbacks as defined in UI-HANDOFF.md
    const rawRole = payload['cognito:groups']?.[0] || payload['custom:role'] || 'UNKNOWN';
    const role = normalizeRole(rawRole);
    
    // UI-HANDOFF.md §3.2: Treat UNKNOWN as unauthorised in the UI
    if (role === 'UNKNOWN') {
      throw new Error("Unauthorized: No recognized role assigned to this account.");
    }
    
    const rawCampus = payload['custom:campus'] || 'BENGALURU';
    const campusId = rawCampus.split(','); // Handles IQAC multi-campus
    const campus = campusId.map(getCampusName);

    const deptObj = normalizeDepartment(payload['custom:department']);
    const facultyId = payload['custom:facultyId'] || payload.sub;

    setUser({
      facultyId,
      role,
      campusId,
      campus,
      departmentId: deptObj.id,
      department: deptObj.name,
      idToken
    });
  };

  useEffect(() => {
    const currentUser = userPool.getCurrentUser();
    if (currentUser) {
      currentUser.getSession((err: any, session: CognitoUserSession | null) => {
        if (err || !session || !session.isValid()) {
          setUser(null);
        } else {
          try {
            processSession(session);
          } catch (e) {
            currentUser.signOut();
            setUser(null);
          }
        }
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  const login = (username: string, password: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const authenticationDetails = new AuthenticationDetails({
        Username: username,
        Password: password
      });

      const cognitoUser = new CognitoUser({
        Username: username,
        Pool: userPool
      });

      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: (result) => {
          try {
            processSession(result);
            resolve();
          } catch (err) {
            cognitoUser.signOut();
            reject(err);
          }
        },
        onFailure: (err) => {
          reject(err);
        }
      });
    });
  };

  const logout = () => {
    const currentUser = userPool.getCurrentUser();
    if (currentUser) {
      currentUser.signOut();
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
