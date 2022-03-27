(function() {
  const _setup = setup as any

  _setup.Complete_EndingBloodyFaithful_Meetup = function() {
    const _vars = State.variables as any

    if (_vars.EndingBloodyFaithful_Meetup &&
        _vars.EndingBloodyApostate_Meetup) {
      const apostateChoice = _vars.EndingBloodyApostate_Meetup.choice
      delete _vars.EndingBloodyFaithful_Meetup
      delete _vars.EndingBloodyApostate_Meetup

      if (apostateChoice === "ESCAPE") {
        Engine.play("EndingBloodyFaithful_Meetup_Escape")
      } else if (apostateChoice === "STEAL") {
        Engine.play("EndingBloodyFaithful_Meetup_Steal")
      } else if (apostateChoice === "DUNNO") {
        Engine.play("EndingBloodyFaithful_Meetup_Dunno")
      }
    }
  }
})()