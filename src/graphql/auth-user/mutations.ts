import gql from 'graphql-tag'

export const mRegisterUser = gql`
mutation RegisterUser($data: UserRegisterInputData!) {
  registerUser(data: $data)
}
`

export const mLoginUser = gql`
mutation LoginUser($data: LoginUserInputData!) {
  loginUser(data: $data)
}
`

export const mLogoutUser = gql`
mutation LogoutUser {
  logoutUser
}
`

export const mRefreshToken = gql`
mutation RefreshToken {
  refreshToken
}
`

export const mConfirmEmail = gql`
mutation ConfirmEmail($confirmEmailToken: String!) {
  confirmEmail(confirmEmailToken: $confirmEmailToken)
}
`

export const mResendEmailConfirmation = gql`
mutation ResendEmailConfirmation($email: String!) {
  resendEmailConfirmation(email: $email)
}
`

// todo: this needs to return true/false
export const mUpdateUserPreferences = gql`
mutation UpdateUserPreferences($data: UserPreferencesInputData!) {
  updateUserPreferences(data: $data) {
    id
  }
}
`

export const mUpdateUser = gql`
mutation UpdateUser($data: UpdateUserInputData!) {
  updateUser(data: $data)
}
`

export const mResetPassword = gql`
mutation ForgotPassword($email: String!) {
  forgotPassword(email: $email)
}
`

export const mSetNewPassword = gql`
mutation ResetPassword($newPassword: String!, $resetPasswordToken: String!) {
  resetPassword(newPassword: $newPassword, resetPasswordToken: $resetPasswordToken)
}
`
