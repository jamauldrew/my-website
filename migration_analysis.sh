#!/bin/bash

# Create analysis directory
mkdir -p migration-analysis

# Analyze component dependencies
echo "Analyzing component dependencies..."
find src/components -name "*.tsx" -o -name "*.jsx" | while read file; do
    echo "Analyzing $file..."
    grep -h "^import" "$file" >> migration-analysis/component-dependencies.txt
done

# Extract component exports
find src/components -name "*.tsx" -o -name "*.jsx" | while read file; do
    grep -h "^export" "$file" >> migration-analysis/component-exports.txt
done

# Extract routes
grep -r "Route" src/ >> migration-analysis/routes.txt

# Collect static assets
find public/images -type f >> migration-analysis/static-assets.txt
find images -type f >> migration-analysis/static-assets.txt
find src/assets -type f >> migration-analysis/static-assets.txt

chmod +x migration_analysis.sh
