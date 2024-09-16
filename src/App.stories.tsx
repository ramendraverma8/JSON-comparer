import React from 'react';
import { StoryObj, Meta } from '@storybook/react';
// import { jest } from '@storybook/jest';
import { within, userEvent, waitFor, expect, screen, fireEvent } from '@storybook/test';
import App from './App';

const meta = {
  title: 'App',
  component: App,
} as Meta<typeof App>;

export default meta;
type Story = StoryObj<typeof App>;

// Helper function to open the dialog
const openDialog = async (canvas: ReturnType<typeof within>) => {
  userEvent.click(canvas.getByText('Add New'));
  const dialog = await screen.findByRole('dialog', { name: 'Add JSON' });
  return within(dialog);
};

// Helper function to close the dialog
const closeDialog = async (dialogContent: ReturnType<typeof within>) => {
  userEvent.click(dialogContent.getByRole('button', { name: 'OK' }));
  await waitFor(() => {
    const dialog = screen.queryByRole('dialog', { name: 'Add JSON' });
    expect(dialog).not.toBeInTheDocument();
  }, { timeout: 5000 });
};

// Helper function to find the JSON output container
const findJsonOutputContainer = async (canvasElement: HTMLElement) => {
  const resizableBox = (await within(canvasElement).findAllByTestId('resizable-box'))[0];
  return within(resizableBox).findByTestId('json-output');
};

export const Render: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('New Comparison')).toBeVisible();
    await expect(canvas.getByText('Add New')).toBeVisible();
  },
};

export const OpenDialog: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const dialogContent = await openDialog(canvas);
    await waitFor(() => {
      const heading = dialogContent.queryByRole('heading', { name: 'Add JSON' });
      expect(heading).toBeVisible();
    });

    await expect(dialogContent.getByLabelText(/Enter JSON string/)).toBeVisible();
    await expect(dialogContent.getByRole('button', { name: /Upload JSON File/ })).toBeVisible();
  },
};

export const AddJsonString: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const dialogContent = await openDialog(canvas);
    const jsonInput = dialogContent.getByLabelText(/Enter JSON string/);
    const jsonString = `{ "test":"value" }`;
    userEvent.click(jsonInput);
    userEvent.paste(jsonString);
    fireEvent.change(jsonInput, { target: { value: jsonString } });
    await closeDialog(dialogContent);
    const jsonOutputContainer = await findJsonOutputContainer(canvasElement);
    await waitFor(() => {
      expect(jsonOutputContainer).toHaveTextContent(`test: "value"`);
    });
  },
};

export const AddJsonFile: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const dialogContent = await openDialog(canvas);
    const jsonInput = dialogContent.getByLabelText(/Upload JSON File/);
    const fileContent = JSON.stringify({ name: 'Jane Doe' });
    const file = new File([fileContent], 'test.json', { type: 'application/json' });
    userEvent.click(jsonInput);
    await userEvent.upload(jsonInput, file);
    await fireEvent.change(jsonInput, { target: { files: [file] } });
    await closeDialog(dialogContent);
    const jsonOutputContainer = await findJsonOutputContainer(canvasElement);
    await waitFor(() => {
      expect(jsonOutputContainer).toHaveTextContent(`name: "Jane Doe"`);
    });
  },
};

export const InvalidJsonString: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const dialogContent = await openDialog(canvas);
    const jsonInput = dialogContent.getByLabelText(/Enter JSON string/);
    const jsonString = `{ test:value }`;
    userEvent.click(jsonInput);
    userEvent.paste(jsonString);
    fireEvent.change(jsonInput, { target: { value: jsonString } });
    // jest.spyOn(window, 'alert').mockImplementation(() => {});
    userEvent.click(dialogContent.getByRole('button', { name: 'OK' }));
    await waitFor(() => expect(window.alert).toHaveBeenCalledWith('The entered string is not a valid JSON.'));
  },
};

export const InvalidJsonFile: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const dialogContent = await openDialog(canvas);
    const jsonInput = dialogContent.getByLabelText(/Upload JSON File/);
    const file = new File(['{name: John Doe}'], 'test.json', { type: 'application/json' });
    userEvent.click(jsonInput);
    await userEvent.upload(jsonInput, file);
    await fireEvent.change(jsonInput, { target: { files: [file] } });
    // jest.spyOn(window, 'alert').mockImplementation(() => {});
    userEvent.click(dialogContent.getByRole('button', { name: 'OK' }));
    await waitFor(() => expect(window.alert).toHaveBeenCalledWith('The uploaded file is not a valid JSON.'));
  },
};

export const NewComparison: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const dialogContent = await openDialog(canvas);
    const jsonInput = dialogContent.getByLabelText(/Enter JSON string/);
    const jsonString = `{ "test":"value" }`;
    userEvent.click(jsonInput);
    userEvent.paste(jsonString);
    fireEvent.change(jsonInput, { target: { value: jsonString } });
    await closeDialog(dialogContent);
    const jsonOutputContainer = await findJsonOutputContainer(canvasElement);
    await waitFor(() => {
      expect(jsonOutputContainer).toHaveTextContent(`test: "value"`);
    });
    await userEvent.click(canvas.getByText('New Comparison'));
    await waitFor(() => {
      expect(jsonOutputContainer).toHaveTextContent(`test: "value"`);
    }, { timeout: 5000 });
  },
};