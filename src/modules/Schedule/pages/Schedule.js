import React from 'react';
import { inject, observer } from 'mobx-react';
import Layout from "../../../common/components/Layout"
import ScheduleViewStore from '../stores/ScheduleViewStore'
import { ToastContainer } from 'react-toastify';

import ScheduleForm from '../components/ScheduleForm';

@inject(
    i => ({
        viewStore: new ScheduleViewStore(i.rootStore)
    })
)

@observer
class Schedule extends React.Component {
    render() {
        const { isLoaderVisible, errorMessage, onRefreshClick, isSubmitDisabled, onPasswordChange, password } = this.props.viewStore;
        return (
            <Layout isLoaderVisible={isLoaderVisible}>
                <div style={{ marginTop: 90 }}>
                    <ScheduleForm errorMessage={errorMessage} password={password} onSubmit={onRefreshClick} onPasswordChange={onPasswordChange} isSubmitDisabled={isSubmitDisabled} />
                </div>
                <ToastContainer style={{ fontSize: 15 }} />
            </Layout >
        )
    }
}

export default Schedule;