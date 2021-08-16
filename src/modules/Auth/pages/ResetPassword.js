import React from "react";
import { inject, observer } from 'mobx-react';
import AuthenticationViewStore from '../stores/AuthenticationViewStore';
import ResetPasswordForm from "../components/ResetPasswordForm";
import Loading from '../../../common/components/Loading/Loading';
import { ToastContainer } from 'react-toastify';

import "../../../common/styles/Form.css"

@inject(
    i => ({
        viewStore: new AuthenticationViewStore(i.rootStore)
    })
)
@observer
class ResetPassword extends React.Component {
    render() {
        const { newPassword, resetPasswordMessage, isLoaderVisible, onNewPasswordChange, isSubmitDisabled, onResetPasswordSubmit, onBackClick } = this.props.viewStore;

        return (
            <React.Fragment>
                <Loading visible={isLoaderVisible} />
                <ToastContainer style={{ fontSize: 15 }} />
                <div className="formContainer">
                    <ResetPasswordForm newPassword={newPassword} onSubmit={onResetPasswordSubmit} onBackClick={onBackClick} onNewPasswordChange={onNewPasswordChange} resetPasswordMessage={resetPasswordMessage} isSubmitDisabled={isSubmitDisabled} />
                </div>
            </React.Fragment>
        );
    };
}

export default ResetPassword;