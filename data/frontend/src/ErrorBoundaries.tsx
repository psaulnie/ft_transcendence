import React, { ErrorInfo, ReactElement } from "react";
import { Button, Typography, Box } from "@mui/material";

interface ErrorBoundaryState {
    hasError: boolean
    errorMessage: string
}
interface ErrorboundaryProps {
    children: ReactElement
}

export class ErrorBoundaries extends React.Component<ErrorboundaryProps, ErrorBoundaryState>{
    constructor(props: ErrorboundaryProps){
        super(props)
        this.state = {
                        hasError : false,
                        errorMessage: ""
                     }
    }
    componentDidCatch(error: Error, errorInfo: ErrorInfo){
        this.setState({hasError: true})
        this.setState({errorMessage: error.message})
        //Do something with err and errorInfo
    }
    render(): React.ReactNode {
        if(this.state?.hasError){
            return(
                <Box sx={{borderRadius:'1em', backgroundColor:'#D9D9D9', marginTop:'10em', marginLeft:'2.5em', border:'black solid', padding:'0.5em', position: "fixed"}} className="divClass">
                    <Typography sx={{fontSize:'28px', marginLeft:'2.6em'}}>Error</Typography>
                    <Typography sx={{fontSize:'20px'}}> {this.state.errorMessage} </Typography>
                    <Button sx={{lineHeight: '3', height: "1.8em", color:'black', fontSize:'12px', marginLeft:'6em', border:'black solid', borderWidth:'2px', backgroundColor:'#FE8F29'}}>reload</Button>
                </Box>
            )
        }
        return(this.props.children)
    }
}