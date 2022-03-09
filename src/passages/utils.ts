(function() {
  const _setup = setup as any

  _setup.Constants = {}
  _setup.Constants.SENDING = "<strong>Sending to server...</strong>"
  _setup.Constants.WAITING = "<strong>Waiting for partner...</strong>"

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

  _setup.replaceWithSending = function(selector: string) {
    $(selector).html(_setup.Constants.SENDING)
  }

  _setup.replaceWithWaiting = function(selector: string) {
    $(selector).html(_setup.Constants.WAITING)
  }
})()