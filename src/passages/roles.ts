(function() {
  const _setup = setup as any

  _setup.getRole = function(): string | undefined {
    if (State.getVar('$hostClientId') == State.getVar('$clientId')) {
      return State.getVar('$hostCharacterRole')
    } else {
      return State.getVar('$partnerCharacterRole')
    }
  };

  _setup.isFaithful = function(): boolean {
    return _setup.getRole() == 'Faithful'
  }

  _setup.isApostate = function(): boolean {
    return _setup.getRole() == 'Apostate'
  }
})()