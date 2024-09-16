import type { Meta, StoryObj } from '@storybook/react';
import { within, userEvent, expect } from '@storybook/test';
import JsonComparison from './JsonComparison';

const meta = {
  title: 'JsonComparison',
  component: JsonComparison,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof JsonComparison>;

export default meta;
type Story = StoryObj<typeof meta>;

// Mock JSON data for stories
const mockJson1 = {
    name: 'Jane Doe',
    age: 30,
    city: 'Los Angeles',
    occupation: 'Software Engineer',
};

const mockJson2 = {
  name: 'Jane Doe',
  age: 30,
  city: 'Los Angeles',
  occupation: 'Software Engineer',
};

export const Render: Story = {
    args: {
        jsons: [mockJson1],
      },
      play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await expect(canvas.getByText(/Jane Doe/)).toBeInTheDocument();
  },
};

export const SameJsonObject: Story = {
    args: {
      jsons: [mockJson1, mockJson2],
    },
    play: async ({ canvasElement }) => {
      const canvas = within(canvasElement);
      const janeDoeElements = canvas.getAllByText(/Jane Doe/);
      await expect(janeDoeElements.length).toBe(2);
  
      const jsonElements = canvas.getAllByText(/Jane Doe/);
      jsonElements.forEach((element) => {
         expect(element).toHaveStyle('background-color: #DFF0D8'); 
      });
    },
  };
  export const EmptyJsonArray: Story = {
    args: {
      jsons: [],
    },
    play: async ({ canvasElement }) => {
      const canvas = within(canvasElement);
      expect(canvas.queryByText(/Object/)).not.toBeInTheDocument();
    },
  };
  
  export const SingleJsonObject: Story = {
    args: {
      jsons: [mockJson1],
    },
    play: async ({ canvasElement }) => {
      const canvas = within(canvasElement);
      const johnDoeElement = canvas.getByText(/Jane Doe/);
      expect(johnDoeElement).toBeInTheDocument();
      expect(johnDoeElement).toHaveStyle('background-color: #DFF0D8');
      expect(johnDoeElement).toHaveStyle('color: #3C763D');
    },
  };
  
  export const MultipleJsonObjectsDifferentKeys: Story = {
    args: {
      jsons: [mockJson1, { ...mockJson1, newKey: 'newValue' }],
    },
    play: async ({ canvasElement }) => {
      const canvas = within(canvasElement);
      const johnDoeElements = canvas.getAllByText(/Jane Doe/);
      expect(johnDoeElements.length).toBe(2);
      const newKeyElement = canvas.getByText(/newKey/);
      expect(newKeyElement).toBeInTheDocument();
      expect(newKeyElement).toHaveStyle('background-color: rgba(0, 0, 0, 0)');
      expect(newKeyElement).toHaveStyle('color: rgb(0, 0, 0)');
    },
  };
  
  export const MultipleJsonObjectsSameKeysDifferentValues: Story = {
    args: {
      jsons: [mockJson1, { ...mockJson1, age: 35 }],
    },
    play: async ({ canvasElement }) => {
      const canvas = within(canvasElement);
      const johnDoeElements = canvas.getAllByText(/Jane Doe/);
      expect(johnDoeElements.length).toBe(2);
      const ageElement = canvas.getByText(/35/);
      expect(ageElement).toBeInTheDocument();
      expect(ageElement).toHaveStyle('background-color: #FADBD8');
      expect(ageElement).toHaveStyle('color: #31708F');
    },
  };
  
  export const MultipleJsonObjectsSameKeysSameValues: Story = {
    args: {
      jsons: [mockJson1, { ...mockJson1 }],
    },
    play: async ({ canvasElement }) => {
      const canvas = within(canvasElement);
      const johnDoeElements = canvas.getAllByText(/Jane Doe/);
      expect(johnDoeElements.length).toBe(2);
      johnDoeElements.forEach((element) => {
        expect(element).toHaveStyle('background-color: #DFF0D8');
        expect(element).toHaveStyle('color: #3C763D');
      });
    },
  };
  
  export const LargeJsonObjects: Story = {
    args: {
      jsons: [mockJson1, { ...mockJson1, largeKey: 'a'.repeat(1000) }],
    },
    play: async ({ canvasElement }) => {
      const canvas = within(canvasElement);
      const largeKeyElement = canvas.getByText(/largeKey/);
      expect(largeKeyElement).toBeInTheDocument();
      expect(largeKeyElement.parentElement).toHaveStyle('overflow-x: auto');
    },
  };
  
