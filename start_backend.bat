@echo off
echo Starting Rooted Backend...
cd social-media
python -m uvicorn api:app --reload
pause
