// Decides which sides the Stop / SubagentStop hook checks. A maker is checked only on its own side,
// so a finished maker is never blocked by the other maker's unfinished work. The main session (and any
// other agent) is checked on every side that has changes.
const OWN_SIDE = { 'be-maker': 'be', 'fe-maker': 'fe' };

export function sidesToCheck(agent, changed) {
  const own = OWN_SIDE[agent];
  return (own ? [own] : ['be', 'fe']).filter((side) => changed[side]);
}
