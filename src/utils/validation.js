export const validateCredentials = ( username, password ) => {

  //if username or password is not given
  if( !username || !password ) {
    return {
      status: false,
      message: 'Missing Crendentials',
      severity: 'warning',
    }
  }

  //if password length is less than 6 characters (must be atleast 6 characters)
  if( password.trim().length < 6 ) {
    return {
      status: false,
      message: 'Password length atleast 6',
      severity: 'warning'
    }
  }

  //else returning success of validation
  return {
    status: true,
  }
  
}