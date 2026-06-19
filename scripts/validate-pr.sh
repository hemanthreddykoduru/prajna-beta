#!/bin/bash
# PRAJNA Local Pull Request Quality Gate Validation Script
# This script executes all quality verification checks locally.

# Color definitions for terminal output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}====================================================${NC}"
echo -e "${YELLOW}🚀 PRAJNA: Running local PR quality verification...${NC}"
echo -e "${YELLOW}====================================================${NC}"

# Check 1: Code Linting & Formatting Check (ESLint)
echo -e "\n🔍 [1/3] Running ESLint code formatting scan..."
npm run lint
if [ $? -eq 0 ]; then
    echo -e "🟢 ${GREEN}Linting passed successfully!${NC}"
else
    echo -e "🔴 ${RED}Linting failed. Please fix formatting errors shown above.${NC}"
    exit 1
fi

# Check 2: TypeScript Type Safety Check (tsc)
echo -e "\n🔍 [2/3] Checking TypeScript compile type safety..."
npm run typecheck
if [ $? -eq 0 ]; then
    echo -e "🟢 ${GREEN}TypeScript compilation and types verify successfully!${NC}"
else
    echo -e "🔴 ${RED}Type checking failed. Please resolve TS warnings/errors above.${NC}"
    exit 1
fi

# Check 3: Jest Tests & Security Audits (cdk-nag)
echo -e "\n🔍 [3/3] Running Jest unit tests and cdk-nag security audits..."
npm run test
if [ $? -eq 0 ]; then
    echo -e "🟢 ${GREEN}All unit tests and cdk-nag audits passed!${NC}"
else
    echo -e "🔴 ${RED}Testing or cdk-nag audits failed. Inspect the Jest log output.${NC}"
    exit 1
fi

echo -e "\n${GREEN}====================================================${NC}"
echo -e "${GREEN}🎉 CONGRATULATIONS: All quality gates passed!${NC}"
echo -e "${GREEN}   You are ready to submit your Pull Request.        ${NC}"
echo -e "${GREEN}====================================================${NC}"
exit 0
