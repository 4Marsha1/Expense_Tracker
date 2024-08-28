osascript -e 'tell app "Terminal"
    do script "cd /Users/abhishek/Desktop/Expense_Tracker/backend && npm i && npm start"
end tell'

osascript -e 'tell app "Terminal"
    do script "cd /Users/abhishek/Desktop/Expense_Tracker/client && npm i --legacy-peer-deps && npm start"
end tell'