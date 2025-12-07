# CSV File Loading

## File Location
The CSV file (`truestate_assignment_dataset.csv`) is located in the project root directory.

## Path Resolution
From `backend/src/services/data.js`:
- Current directory: `backend/src/services/`
- Path to CSV: `../../truestate_assignment_dataset.csv`
- Full path: `project_root/truestate_assignment_dataset.csv`

## Memory Requirements
The CSV file contains ~1 million records, requiring significant memory:
- Default Node.js memory: ~2GB
- Required memory: ~4GB
- Backend scripts include: `--max-old-space-size=4096`

## Running the Backend
Always use the npm scripts which include memory settings:

```bash
cd backend
npm run dev    # Development (with memory limit)
npm start      # Production (with memory limit)
```

**DO NOT** run directly with `node src/index.js` as it won't have the memory limit!

## Verification
The CSV path is verified on startup:
- File existence check
- Path logging for debugging
- Error messages if file not found

## Troubleshooting

### If CSV not loading:
1. Verify file exists: `ls truestate_assignment_dataset.csv` (in project root)
2. Check backend logs for path information
3. Ensure using `npm run dev` (not direct node command)
4. Check file permissions

### If out of memory:
1. Ensure using npm scripts (they include memory limit)
2. Increase memory if needed: `--max-old-space-size=8192`
3. Check available system memory

