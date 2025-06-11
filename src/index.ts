import { Logger, webpack } from "replugged";
import { PluginInjectorUtils } from "./lib/utils";
import { UserStore } from "replugged/common";

export const PluginLogger = Logger.plugin("ColoredUsernames", "#b380ff");

// Store to keep track of user colors
const userColors = new Map<string, string>();

// Generate a random color
const getRandomColor = () => {
  const colors = [
    "#FF0000", // Red
    "#00FF00", // Green
    "#0000FF", // Blue
    "#FFFF00", // Yellow
    "#FF00FF", // Magenta
    "#00FFFF", // Cyan
    "#FFA500", // Orange
    "#800080", // Purple
    "#008000", // Dark Green
    "#000080", // Navy
    "#800000", // Maroon
    "#008080", // Teal
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

// Get or generate a color for a user
const getUserColor = (userId: string) => {
  if (!userColors.has(userId)) {
    userColors.set(userId, getRandomColor());
  }
  return userColors.get(userId);
};

export function start() {
  // Find the username component
  const UsernameComponent = webpack.getBySource("username-", { all: true });
  if (!UsernameComponent) {
    PluginLogger.error("Could not find username component");
    return;
  }

  // Patch the username component to add color
  PluginInjectorUtils.inject(UsernameComponent, "render", (args, res) => {
    const userId = args[0]?.user?.id;
    if (!userId) return res;

    const color = getUserColor(userId);
    if (!color) return res;

    // Add color style to the username
    const style = {
      ...res.props.style,
      color: color,
    };

    return {
      ...res,
      props: {
        ...res.props,
        style,
      },
    };
  });
}

export function stop() {
  PluginInjectorUtils.removeAll();
  userColors.clear();
}
