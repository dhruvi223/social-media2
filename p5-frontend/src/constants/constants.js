export const emailMessages = {
    empty: "Please enter your email",
    invalid: "Invalid Email address",
  };
  
  export const passwordMessages = {
    empty: "Please enter your password",
    weak: "Password is weak",
  };

  export const mobileMessages = {
    invalid : "Mobile number is invalid"
  }

  export const name = {
    firstname: "Please Enter First name",
    lastname: "Please Enter Last name",
  };

export const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
export const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,32}$/
export const mobileRegex = /^[0-9]{10}$/
export const fullnameRegex = /^[A-Za-z]+$/
