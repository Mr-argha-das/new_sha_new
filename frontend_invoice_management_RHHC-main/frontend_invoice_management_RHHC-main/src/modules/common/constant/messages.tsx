export const messages = {
  REQUIRED: 'Required',
  INVALID: 'Invalid',
  ALREADYEXIST: 'Already Exist',
  SOMETHINGWRONG: 'Something went wrong',
  FILEUPLOADSUCCESS: 'File Upload Success',
  NORECORDSFOUND: 'No Records found',
  NOTFOUND: 'Not found',
  ALREADYSELECTED: 'Already selected',
  COMMONIMPORTSUCCESS: (count: string | number, title: string) =>
    `${count} ${title} are imported`,
  COMMONUPDATE: (title: string) => `${title} updated successfully!`,
  COMMONADDED: (title: string) => `${title} added successfully!`,
  COMMONDELETED: (title: string) => `${title} deleted successfully!`,
};

export const defaultRoles = {
  supAdmin_role_id: 1,
  customer_role_id: 2,
  staff_role_id: 3
};