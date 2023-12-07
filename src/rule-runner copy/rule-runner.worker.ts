import {RulesRunner} from './rules-runner';

const ruleRunner = new RulesRunner();

onmessage = (e) => {
  const originalText = e.data.oldText;
  const newText = ruleRunner.lintText(e.data);
  postMessage({
    originalText: originalText,
    newText: newText,
    ruleSettings: e.data,
  });
};
