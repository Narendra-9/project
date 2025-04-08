import React from 'react'
import { Step, Stepper } from 'react-form-stepper';
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; 
function MyStepper(props) {
    const {activeStep}=props
  return (
    <Stepper
                    activeStep={activeStep} 
                    styleConfig={{
                    activeBgColor: '#FF5640', 
                    completedBgColor: '#2D9C5B', 
                    inactiveBgColor: '', 
                    activeTextColor: 'white !important', 
                    completedTextColor: 'white', 
                    inactiveTextColor: 'white', 
                    size: '3rem', 
                    circleFontSize: '1.2rem', 
                    labelFontSize: '1rem', 
                    borderRadius: '50%', 
                    fontWeight: 'bold', 
                }}
                connectorStyleConfig={{
                    activeColor: '#D32F2F',
                    completedColor: '#2D9C5B', 
                    disabledColor: '#ddd', 
                    size: 2, 
                }}
                >
                    <Step label={activeStep>0?<span>Cart <CheckCircleIcon/></span>:"Cart"} />
                    <Step label={activeStep>1?<span>Add Address <CheckCircleIcon/></span>:"Add Address"} />
                    <Step label={activeStep>2?<span>Payment <CheckCircleIcon/></span>:"Payment"} />
                </Stepper>
  )
}

export default MyStepper