import { createContext, useContext, useEffect, useState } from "react";
import { UserConext } from "./UserContext";
// import SecureLS from "secure-ls";

export const ThemeContext = createContext();
// const ls = new SecureLS({ encodingType: 'aes' });

export function ThemeProvider ({ children }){
    // * State to store boolean of premium status
    const [isPremium, setIsPremium] = useState(false);

    // * userContext
    const {user}=useContext(UserConext)

    // ! Setting the premium status of user.
    useEffect(() => {
        if (user) {
            setIsPremium(user?.premiumActive);
        }
    }, [user]);

    // ! Applying Spacial theme if he has premium.
    useEffect(() => {
        if (isPremium) {
            // Applying the gradient background for premium users
            // ls.set("theme",true);
            document.body.style.background = "linear-gradient(to right, #040404, #000000, #656565)";
        } else {
            // Applying normal background for normal users
            // ls.set("theme",false);
            document.body.style.backgroundColor = "#192b37";
        }
        
    }, [isPremium]);

    return (
        <ThemeContext.Provider value={{ isPremium }}>
            {children}
        </ThemeContext.Provider>
    );
};