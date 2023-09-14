import { Button, createTheme } from "@mui/material";

export const theme = createTheme({
    palette:{
        primary: {
            main: "#8600b3",
            contrastText: "#fff"
        },
        discord:{
            main: "#5663F7",
            contrastText: "#fff"
        }
    },
    Button:{
        color: "primary", 
    },
    Box:{
        
    },
    overrides: {
        MuiButton: {
            contained: {
                borderRadius: '2',
            }
        },
        MuiContainer:{
            root:{
                borderRadius: 5
            }
        },
        MuiBox:{
            root:{
                borderRadius: 5,
                
            }
        }
    },
    typography:{
        fontFamily: "Open Sans",
    }
})