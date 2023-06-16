import { assertTrue } from '@src/utils/assert';

interface IServiceFactory<T> {
  new (symbol: symbol): T;
}

const registry = new Map<IServiceFactory<Service>, Service>();

const preventOusideNew = Symbol();

const getInstance = <G extends IServiceFactory<Service>>(
  Klass: G
): InstanceType<G> => {
  const instance = registry.get(Klass) as InstanceType<G>;

  if (instance) {
    return instance;
  }

  const newInstance = new Klass(preventOusideNew) as InstanceType<G>;

  registry.set(Klass, newInstance);

  newInstance.init$();

  return newInstance;
};

export abstract class Service {
  // 防止外部创建实例
  constructor(symbol: symbol) {
    assertTrue(preventOusideNew === symbol);
  }

  static getInstance = getInstance;

  getInstance = getInstance;

  private inited$ = false;
  init$() {
    if (this.inited$) {
      return;
    }

    this.inited$ = true;

    this.mounted();
  }

  mounted() {
    // ignore
  }
}
