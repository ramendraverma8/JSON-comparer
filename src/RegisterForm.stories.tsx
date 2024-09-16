import React from "react";
import { StoryObj, Meta } from "@storybook/react";
import {
  within,
  userEvent,
  waitFor,
  expect,
  screen,
  fireEvent,
} from "@storybook/test";
import RegisterForm from "./RegisterForm";

const meta = {
  title: "RegisterForm",
  component: RegisterForm,
} as Meta<typeof RegisterForm>;

export default meta;
type Story = StoryObj<typeof RegisterForm>;

export const Render: Story = {
  args: {
    open: true,
    onClose: () => {},
  },
  play: async ({}) => {
    const dialogContent = await screen.findByRole("dialog", {
      name: "Register",
    });
    await waitFor(() => {
      const heading = within(dialogContent).queryByRole("heading", {
        name: "Register",
      });
      expect(heading).toBeVisible();
    });

    const { getByLabelText, getByTestId } = within(dialogContent);

    const firstNameInput = getByLabelText("Firstname") as HTMLInputElement;
    const lastNameInput = getByLabelText("Lastname") as HTMLInputElement;
    const addressInput = getByLabelText("Address") as HTMLInputElement;
    const emailInput = getByLabelText("Email") as HTMLInputElement;
    const departmentSelect = getByTestId("department-select");
    const employmentTypeSelect = getByTestId("employment-select");

    expect(firstNameInput).toBeInTheDocument();
    expect(lastNameInput).toBeInTheDocument();
    expect(addressInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(departmentSelect).toBeInTheDocument();
    expect(employmentTypeSelect).toBeInTheDocument();
  },
};

export const EmptyFields: Story = {
  args: {
    open: true,
    onClose: () => {},
  },
  play: async ({ canvasElement }) => {
    // Wait for the dialog to be visible
    const dialogContent = await screen.findByRole("dialog", {
      name: "Register",
    });

    // Find and click the OK button
    const okButton = within(dialogContent).getByRole("button", { name: "OK" });
    await userEvent.click(okButton);

    // Wait for and check each error message
    await waitFor(() => {
      expect(
        within(dialogContent).getByText("Firstname is required")
      ).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(
        within(dialogContent).getByText("Lastname is required")
      ).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(
        within(dialogContent).getByText("Email is required")
      ).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(
        within(dialogContent).getByText("Employment type is required")
      ).toBeInTheDocument();
    });
  },
};
export const InputChangeValidation: Story = {
  args: {
    open: true,
    onClose: () => {},
  },
  play: async () => {
    const dialogContent = await screen.findByRole("dialog", {
      name: "Register",
    });
    const firstname = within(dialogContent).getByLabelText("Firstname");
    const lastNameInput = within(dialogContent).getByLabelText("Lastname");
    const emailInput = within(dialogContent).getByLabelText("Email");
    const okButton = within(dialogContent).getByRole("button", { name: "OK" });
    const departmentSelect =
      within(dialogContent).getByTestId("department-select");
    await userEvent.type(firstname, "John");
    await userEvent.type(lastNameInput, "Doe");
    await userEvent.type(emailInput, "invalid-email");
    fireEvent.click(okButton);
    await waitFor(() => {
      expect(
        within(dialogContent).getByText("Email is not valid")
      ).toBeInTheDocument();
    });
    await userEvent.clear(emailInput);
    await userEvent.type(emailInput, "test@example.com");
    await waitFor(
      () => {
        userEvent.click(departmentSelect);
      },
      { timeout: 55000 }
    );
    await waitFor(
      () => {
        const HRbutton = within(dialogContent).getByRole("option", {
          name: "HR",
        });
        fireEvent.click(HRbutton);
        //  userEvent.click(within(dialogContent).getByRole('option', { name: 'Development' }))
      },
      { timeout: 5000 }
    );
  },
};
export const RegisterUser: Story = {
  args: {
    open: true,
    onClose: () => {},
  },
  play: async () => {
    const dialogContent = await screen.findByRole("dialog", {
      name: "Register",
    });
    const firstname = within(dialogContent).getByLabelText("Firstname");
    const lastNameInput = within(dialogContent).getByLabelText("Lastname");
    const emailInput = within(dialogContent).getByLabelText("Email");
    const okButton = within(dialogContent).getByRole("button", { name: "OK" });
    const departmentSelect =
      within(dialogContent).getByTestId("department-select");
    await userEvent.type(firstname, "John");
    await userEvent.type(lastNameInput, "Doe");
    await userEvent.type(emailInput, "ramen@gmail.com");
    fireEvent.click(okButton);
    await waitFor(
      () => {
        userEvent.click(departmentSelect);
      },
      { timeout: 55000 }
    );
    await waitFor(
      () => {
        const HRbutton = within(dialogContent).getByRole("option", {
          name: "HR",
        });
        fireEvent.click(HRbutton);
        userEvent.click(
          within(dialogContent).getByRole("option", { name: "Development" })
        );
      },
      { timeout: 5000 }
    );
  },
};
export const CheckDateePicker: Story = {
  args: {
    open: true,
    onClose: () => {},
  },
  play: async () => {
    const dialogContent = await screen.findByRole("dialog", {
      name: "Register",
    });
    const startDateInput = within(dialogContent).getByLabelText("Start Date");
    await userEvent.click(startDateInput);
    // Verify that the DatePicker dialog opens
    const dialogs = await screen.findAllByRole("dialog");
    const datePickerDialog = dialogs[1];
    expect(datePickerDialog).toBeInTheDocument();
  },
};

export const CheckDateValidation: Story = {
  args: {
    open: true,
    onClose: () => {},
  },
  play: async () => {
    const dialogContent = await screen.findByRole("dialog", {
      name: "Register",
    });
    const registerButton = within(dialogContent).getByRole("button", {
      name: "OK",
    });
    await userEvent.click(registerButton);

    // Verify that the error message is shown
    const errorMessage = await within(dialogContent).findByText(
      "Start date is required"
    );
    expect(errorMessage).toBeInTheDocument();
  },
};
export const CheckDateSelection: Story = {
  args: {
    open: true,
    onClose: () => {},
  },
  play: async () => {
    const dialogContent = await screen.findByRole("dialog", {
      name: "Register",
    });
    const startDateInput = within(dialogContent).getByLabelText("Start Date");
    await userEvent.click(startDateInput);

    // Select a date
    const dialogs = await screen.findAllByRole("dialog");
    const datePickerDialog = dialogs[1];
    const dateButton = within(datePickerDialog).getByRole("button", {
      name: "15",
    });
    await userEvent.click(dateButton);

    // Confirm the date selection
    const okButton = within(datePickerDialog).getByRole("button", {
      name: /ok/i,
    });
    await userEvent.click(okButton);

    // Verify that the input field is updated with the selected date
    expect(startDateInput).toHaveValue("09/15/2024"); // Adjust the date format as needed
  },
};
