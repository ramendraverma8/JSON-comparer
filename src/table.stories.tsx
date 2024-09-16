// table.stories.tsx
import React from 'react-dom/test-utils';
import { StoryObj, Meta } from '@storybook/react';
import { within, userEvent, waitFor, expect, screen,fireEvent } from '@storybook/test';
import Table from './table';

const meta = {
  title: 'Table',
  component: Table,
} as Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof Table>;

export const Render: Story = {
    play: async () => {
      const table = await screen.findByTestId('table-test');
      expect(table).toBeInTheDocument();
  
      const withinTable = within(table);
      const row = withinTable.getByRole('row', { name: /John Doe IT 2020-01-15/i });
      expect(row).toBeInTheDocument();
  
      const firstNameCell = withinTable.getByText('John');
      expect(firstNameCell).toBeInTheDocument();
  
      const lastNameCell = withinTable.getByText('Doe');
      expect(lastNameCell).toBeInTheDocument();
  
      const departmentCell = within(row).getByText('IT');
      expect(departmentCell).toBeInTheDocument();
  
      const startDateCell = withinTable.getByText('2020-01-15');
      expect(startDateCell).toBeInTheDocument();
    },
  };
  export const CheckColumnHeaders: Story = {
    play: async () => {
      const table = await screen.findByTestId('table-test');
      expect(table).toBeInTheDocument();
  
      const withinTable = within(table);
      const headers = ['First Name', 'Last Name', 'Department', 'Start Date'];
      headers.forEach((header) => {
        const headerElement = withinTable.getByRole('columnheader', { name: header });
        expect(headerElement).toBeInTheDocument();
      });
    },
  };
  export const CheckRowCount: Story = {
    play: async ({ canvasElement }) => {
      const table = await screen.findByTestId('table-test');
      expect(table).toBeInTheDocument();
      const withinTable = within(table);
      const rows = withinTable.getAllByRole('row');
      expect(rows.length).toBeGreaterThan(1); 
    },
  };

export const CheckSorting: Story = {
  render: () => <Table />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const table = await canvas.findByTestId('table-test');
    expect(table).toBeInTheDocument();

    const withinTable = within(table);
    const header = withinTable.getByText('First Name');
    expect(header).toBeDefined();
    expect(header).toBeInTheDocument();

    // Click the header to sort by 'First Name'
    await userEvent.click(header);

    // Wait for the sorting to be applied
    await waitFor(() => {
      const rows = withinTable.getAllByRole('row').slice(1);
      return rows.length > 0;
    });

    // Get the sorted rows
    const rows = withinTable.getAllByRole('row').slice(1);


    // Extract the first names from the rows
    const firstNames = rows.map(row => {
      const cells = within(row).getAllByRole('gridcell');
      return cells[0].textContent || '';
    });

    // Sort the first names
    const sortedFirstNames = [...firstNames].sort((a, b) => a.localeCompare(b));

    // Debug: Log the expected and received order
    console.log('Expected order:', sortedFirstNames);
    console.log('Received order:', firstNames);

    // Check that the first names are sorted
    expect(firstNames).toEqual(sortedFirstNames);
  },
};
// export const CheckFiltering: Story = {
//     render: () => <Table />,
//     play: async ({ canvasElement }) => {
//       const canvas = within(canvasElement);
//       const table = await canvas.findByTestId('table-test');
//       expect(table).toBeInTheDocument();
  
//       const withinTable = within(table);
//       const headerCell = withinTable.getByRole('columnheader', { name: 'Department' });
//       console.log(headerCell,"headercell")
//       console.log(within(headerCell).queryAllByRole('presentation'));
//       console.log(within(headerCell).getByRole('presentation', { name: /filter/i, selector: '.ag-header-icon.ag-header-cell-filter-button' }));
//     const filterIconParent = within(headerCell).queryAllByRole('presentation').find(element => 
//         element.classList.contains('ag-header-icon') && 
//         element.classList.contains('ag-header-cell-filter-button')
//       );
//     console.log("filterIcon", filterIconParent);
//       expect(filterIconParent).toBeDefined();

//     //   const filterButton = within(headerCell).getByRole('button', { name: /filter/i }); // Assuming AG Grid's filter button has this role
//       if (filterIconParent) {
//         await userEvent.click(filterIconParent);
//       }
//     }};