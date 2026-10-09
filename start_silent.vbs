Set WshShell = CreateObject("WScript.Shell")
WshShell.CurrentDirectory = "C:\Users\kumar\Desktop\NVN-India-Portal"
WshShell.Run "cmd.exe /c start_background.bat", 0, False
