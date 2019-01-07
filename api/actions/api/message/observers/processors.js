/**
 * Created by isaac on 16/5/19.
 */

const processors = {};
export function registerProcessor(name, processor) {
  processors[name] = processor;
}

export default processors;