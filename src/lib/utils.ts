import { Injector } from "replugged";

export const PluginInjector = new Injector();
export const PluginInjectorUtils = {
  inject: (module: any, method: string, callback: Function) => {
    return PluginInjector.inject(module, method, callback);
  },
  removeAll: () => {
    PluginInjector.uninjectAll();
  }
}; 