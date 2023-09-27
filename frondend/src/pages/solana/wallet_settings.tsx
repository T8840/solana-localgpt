/* eslint-disable jsx-a11y/anchor-is-valid */
import {
    Breadcrumb,
    Button,
    Label,
    Modal,
    Table,
    TextInput,
  } from "flowbite-react";
  import type { FC } from "react";
  import { useState } from "react";
  import {
    HiHome,
    HiOutlineExclamationCircle,
    HiTrash,
  } from "react-icons/hi";
import { useUserStateContext } from "../../context/UserStateContext";
import NavbarSidebarLayout from "../../layouts/navbar-sidebar";
  
  const UserWalletSettingsPage: FC = function () {
    
    return (
      <NavbarSidebarLayout isFooter={false}>
        <div className="block items-center justify-between border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 sm:flex">
          <div className="mb-1 w-full">
            <div className="mb-4">
              <Breadcrumb className="mb-4">
                <Breadcrumb.Item href="/">
                  <div className="flex items-center gap-x-3">
                    <HiHome className="text-xl" />
                    <span className="dark:text-white">Home</span>
                  </div>
                </Breadcrumb.Item>
                <Breadcrumb.Item>User Wallet Settings</Breadcrumb.Item>
              </Breadcrumb>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
              User Wallet Settings
              </h1>
            </div>
            <div className="block items-center sm:flex">
              <div className="flex w-full items-center sm:justify-end">
                <AddProductModal />
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-hidden shadow">
                <ProductsTable />
              </div>
            </div>
          </div>
        </div>
      </NavbarSidebarLayout>
    );
  };
  
  const AddProductModal: FC = function () {
    const [isOpen, setOpen] = useState(false);
  
    return (
      <>
        {/* <Button color="primary" onClick={() => setOpen(!isOpen)}>
          <FaPlus className="mr-3 text-sm" />
          Create new key
        </Button> */}
        <Modal onClose={() => setOpen(false)} show={isOpen}>
          <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
            <strong>Create new API key</strong>
          </Modal.Header>
          <Modal.Body>
            <form>
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div>
                  <Label htmlFor="apiKeys.label">Label</Label>
                  <TextInput
                    id="apiKeys.label"
                    name="apiKeys.label"
                    placeholder='Name of the API key, e.g. "Production"'
                    className="mt-1"
                  />
                </div>
                <div className="lg:col-span-2">
                  <Label htmlFor="apiKeys.newKey">Value</Label>
                  <TextInput
                    id="apiKeys.newKey"
                    name="apiKeys.newKey"
                    disabled={false}
                    readOnly={true}
                    className="mt-1"
                    value="sk_test_LNshPE5SsFVVz4PIKQmM4H9CMx0hikKvoaIewlSrer"
                    helperText="Make sure you store this API key somewhere safe. It will never be shown again."
                  />
                </div>
              </div>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button color="primary" onClick={() => setOpen(false)}>
              Save
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  };
  
  const EditProductModal: FC = function () {
    const [isOpen, setOpen] = useState(false);
  
    return (
      <>
        <Button color="failure" onClick={() => setOpen(!isOpen)}>
          <HiTrash className="mr-2 text-lg" />
          Edit Value
        </Button>
        <Modal onClose={() => setOpen(false)} show={isOpen} size="md">
          <Modal.Header className="px-3 pt-3 pb-0">
            <span className="sr-only">Edit product</span>
          </Modal.Header>
          <Modal.Body className="px-6 pb-6 pt-0">
            <div className="flex flex-col items-center gap-y-6 text-center">
              <HiOutlineExclamationCircle className="text-7xl text-blue-600" />
              <p className="text-lg text-gray-500 dark:text-gray-300">
                Are you sure you want to edit this value?
              </p>
        
              <div className="flex items-center gap-x-3">
                <Button color="failure" onClick={() => setOpen(false)}>
                  Yes, I'm sure
                </Button>
                <Button color="gray" onClick={() => setOpen(false)}>
                  No, cancel
                </Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </>
    );
  };


  
  const ProductsTable: FC = function () {
    const {bearer,wallet_address, wallet_private_key} = useUserStateContext()
    const testAPIKeys = [
        {
            id: 1,
            label: "Wallet Address",
            value: bearer,
        },
        {
          id: 2,
          label: "Wallet Private Key",
          value: wallet_private_key,

        },
        {
            id: 3,
            label: "Email",
        },
        {
            id: 4,
            label: "Email Password",
        },
      ]


    return (
      <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
        <Table.Head className="bg-gray-100 dark:bg-gray-700">
          <Table.HeadCell>Label</Table.HeadCell>
          <Table.HeadCell>Value</Table.HeadCell>
          {/* <Table.HeadCell>Created</Table.HeadCell>
          <Table.HeadCell>Last Used</Table.HeadCell>*/}
          <Table.HeadCell>Actions</Table.HeadCell> 
        </Table.Head>
        <Table.Body className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
            {testAPIKeys.map((key, i) => (
            <Table.Row key={i} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                <Table.Cell className="whitespace-nowrap p-4 text-sm font-normal text-gray-500 dark:text-gray-400">
                    <div className="text-base font-semibold text-gray-900 dark:text-white">
                        {key.label}
                    </div>
                </Table.Cell>
                <Table.Cell className="whitespace-nowrap p-4 text-sm font-normal text-gray-500 dark:text-gray-400">
                    <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
                        {key.value}
                    </div>
                </Table.Cell>
                {/* <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
                {key.created}
                </Table.Cell>
                <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
                {key.last_used}
                </Table.Cell> */}
                <Table.Cell className="space-x-2 whitespace-nowrap p-4">
                    <div className="flex items-center gap-x-3">
                        <EditProductModal />
                    </div>
                </Table.Cell> 
            </Table.Row>
            ))}
        </Table.Body>
      </Table>
    );
  };
  
  export default UserWalletSettingsPage;
