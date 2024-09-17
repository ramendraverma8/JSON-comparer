import React from "react";
import { StoryObj, Meta } from "@storybook/react";
import {
  within, userEvent, waitFor, expect, screen, fireEvent,} from "@storybook/test";
import MyTabs from './tab';

const meta = {
  title: "Tabs",
  component: MyTabs,
} as Meta<typeof MyTabs>;

export default meta;
type Story = StoryObj<typeof MyTabs>;

export const Render: Story = {
    args: {},
    play: async () => {
        const tabPanelOne = await screen.findByRole('tabpanel', { hidden: false });
        expect(tabPanelOne).toHaveTextContent('Item One');
        const tabPanelTwo = screen.getByRole('tabpanel', { hidden: false, name: /Item Two/i });
        const tabPanelThree = screen.getByRole('tabpanel', { hidden: true, name: /Item Three/i });    
        expect(tabPanelTwo).toHaveTextContent('Item Two');
        expect(tabPanelThree).toHaveTextContent('Item Three');
  },
  };
  export const SwitchTabs: Story = {
    args: {},
    play: async () => {
      // Verify that the first tab is selected by default
      const tabPanel = await screen.findByRole('tabpanel', { hidden: false });
      expect(tabPanel).toHaveTextContent('Item One');
  
      // Click on the second tab
      const tabTwo = screen.getByRole('tab', { name: /item two/i });
      await userEvent.click(tabTwo);
      await waitFor(() => expect(screen.getByRole('tabpanel', { hidden: false })).toHaveTextContent('Item Two'));
  
      // Click on the third tab
      const tabThree = screen.getByRole('tab', { name: /item three/i });
      await userEvent.click(tabThree);
      await waitFor(() => expect(screen.getByRole('tabpanel', { hidden: false })).toHaveTextContent('Item Three'));
    },
  };