import React from 'react';
import { inject, observer } from 'mobx-react';
import Layout from "../../../common/components/Layout"
import UserViewStore from '../stores/UserViewStore'
import Table from '../../../common/components/Table/Table';
import ModalUser from '../components/ModalUser';
import { ToastContainer } from 'react-toastify';
import { Button, Dropdown, DropdownButton } from 'react-bootstrap';

import "../styles/User.css";

@inject(
    i => ({
        viewStore: new UserViewStore(i.rootStore)
    })
)

@observer
class User extends React.Component {
    render() {
        const { isLoaderVisible, roleFilter, onResetFilterClick, onRoleFilterChange, errorMessage, title, clickedUser, onRoleChange, columns, rows, roles, page, pageSize, totalPages, previousEnabled, nextEnabled, isSubmitDisabled, onPageClick, onChangePageSize, onFirstNameChange, onLastNameChange, onEmailChange, onPhoneChange, onPasswordChange, onUserClicked, onPreviousPageClick, onNextPageClick, onEditClick, onDeleteClick, onCreateClick } = this.props.viewStore;

        let tableRows = rows.map((element, i) => {
            let phoneNumber = "";
            if (element.phone.length > 6) {
                phoneNumber = element.phone.slice(0, 3) + "-" + element.phone.slice(3, 6) + "-" + element.phone.slice(6, element.phone.length);
            }
            else {
                phoneNumber = element.phone.slice(0, 3) + "-" + element.phone.slice(3, element.phone.length)
            }
            return (<tr key={i}>
                <td className="cell">{element.fname} {element.lname}</td>
                <td className="cell">{element.email}</td>
                <td className="cell">{phoneNumber}</td>
                <td className="cell">{element.role_name}</td>
                <td className="cell btnCell">
                    {
                        element.id !== "" ?
                            <button type="button" onClick={() => onUserClicked(element, false)} data-toggle="modal" data-target="#modalTargetEdit" className="btn btn-primary btnAction btn-rounded btn-sm my-0">
                                Izmijeni
                            </button>
                            :
                            null
                    }
                </td>
                <td className="cell btnCell">
                    {
                        element.id !== "" ?
                            <button type="button" onClick={() => onUserClicked(element, false)} data-toggle="modal" data-target="#modalTargetDelete" className="btn btn-danger btnAction btn-rounded btn-sm my-0">
                                Obriši
                            </button>
                            :
                            null
                    }
                </td>
            </tr>);
        });

        let filterRow = (
            <div className="filterCard" style={{ marginBottom: 10 }}>
                <div className="row">
                    <div className="col-md-2 filterColumn">
                        <span id="filterTitle">FILTERI</span>
                    </div>
                    <div className="col-md-3 filterColumn">
                        <button className="btn btn-light dropdown-toggle" type="button" id="dropdownMenuPageSizeSecond" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            {pageSize}
                        </button>
                        <div className="dropdown-menu pagesize" aria-labelledby="dropdownMenuPageSizeSecond">
                            <button className="dropdown-item" onClick={() => onChangePageSize(5)} type="button">5</button>
                            <button className="dropdown-item" onClick={() => onChangePageSize(10)} type="button">10</button>
                            <button className="dropdown-item" onClick={() => onChangePageSize(15)} type="button">15</button>
                        </div>
                    </div>
                    <div className='col-md-4 filterColumn'>
                        <DropdownButton style={{ margin: "auto" }} className="vertical-center roleDropdown lowerDropdown" variant="light" title={roleFilter.name ? roleFilter.name : "Sve uloge"} style={{ marginBottom: 10 }}>
                            <Dropdown.Item key="default_role" onSelect={() => onRoleFilterChange({ role_id: "", role_name: "" })}>Sve uloge</Dropdown.Item>
                            {roles.map((role) => {
                                return <Dropdown.Item key={role.role_id} onSelect={() => onRoleFilterChange(role)}>{role.role_name}</Dropdown.Item>;
                            })
                            }
                        </DropdownButton>
                    </div>
                    <div className='col-md-3 filterColumn'>
                        <Button className="btn btn-dark btnReset" onClick={(e) => { e.preventDefault(); onResetFilterClick() }}>Resetiraj</Button>
                    </div>
                </div>
            </div>);
        return (
            <Layout isLoaderVisible={isLoaderVisible}>
                <ModalUser modalTarget="modalTargetAdd" errorMessage={errorMessage} roles={roles} onSubmit={onCreateClick} role_name={clickedUser.role_name} fname={clickedUser.fname} lname={clickedUser.lname} email={clickedUser.email} phone={clickedUser.phone} password={clickedUser.password} onFirstNameChange={onFirstNameChange} onLastNameChange={onLastNameChange} onEmailChange={onEmailChange} onPhoneChange={onPhoneChange} onPasswordChange={onPasswordChange} onRoleChange={onRoleChange} isSubmitDisabled={isSubmitDisabled} />
                <ModalUser modalTarget="modalTargetEdit" errorMessage={errorMessage} roles={roles} onSubmit={onEditClick} role_name={clickedUser.role_name} fname={clickedUser.fname} lname={clickedUser.lname} email={clickedUser.email} phone={clickedUser.phone} password={clickedUser.password} onFirstNameChange={onFirstNameChange} onLastNameChange={onLastNameChange} onEmailChange={onEmailChange} onPhoneChange={onPhoneChange} onPasswordChange={onPasswordChange} onRoleChange={onRoleChange} isSubmitDisabled={isSubmitDisabled} />
                <ModalUser modalTarget="modalTargetDelete" errorMessage={errorMessage} roles={roles} onSubmit={onDeleteClick} role_name={clickedUser.role_name} fname={clickedUser.fname} lname={clickedUser.lname} email={clickedUser.email} phone={clickedUser.phone} password={clickedUser.password} onFirstNameChange={onFirstNameChange} onLastNameChange={onLastNameChange} onEmailChange={onEmailChange} onPhoneChange={onPhoneChange} onPasswordChange={onPasswordChange} onRoleChange={onRoleChange} isSubmitDisabled={isSubmitDisabled} />
                <Table filterRow={filterRow} title={title} columns={columns} tableRows={tableRows} page={page} pageSize={pageSize} totalPages={totalPages} previousEnabled={previousEnabled} nextEnabled={nextEnabled} onActionClicked={onUserClicked} onPageClick={onPageClick} onChangePageSize={onChangePageSize} onPreviousPageClick={onPreviousPageClick} onNextPageClick={onNextPageClick} />
                <ToastContainer style={{ fontSize: 15 }} />
            </Layout>
        )

    }
}

export default User;