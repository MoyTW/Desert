(function() {
  const _setup = setup as any

  _setup.Complete_EndingSharedFaithful_Meetup = function() {
    const _vars = State.variables as any

    if (_vars.EndingSharedFaithful_Meetup &&
        _vars.EndingSharedApostate_Meetup_Choice) {
      const apostateChoice = _vars.EndingSharedApostate_Meetup_Choice.choice
      delete _vars.EndingSharedFaithful_Meetup
      delete _vars.EndingSharedApostate_Meetup_Choice

      if (apostateChoice === "ESCAPE") {
        Engine.play("EndingSharedFaithful_Meetup_Escape")
      } else if (apostateChoice === "STEAL") {
        Engine.play("EndingSharedFaithful_Meetup_Steal")
      } else if (apostateChoice === "DUNNO") {
        Engine.play("EndingSharedFaithful_Meetup_Dunno")
      }
    }
  }
})()