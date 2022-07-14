!macro customUnInstall
  DeleteRegValue HKLM "C:\Users\USER1\AppData\Local" "chip_project-updater"
  SetOutPath $LOCALAPPDATA\Programs
  RMDir /r "$LOCALAPPDATA\Programs\chip_project"
  RMDir /r "$LOCALAPPDATA\chip_project-updater"
  
!macroend