(function() {
  const _setup = setup as any

  _setup.Route_ConvoFaithful_Receiver = function() {
    const _vars = State.variables as any;

    if (_vars.ConvoFaithful_Continue && _vars.ConvoApostate_Choices) {
      const apostateChoice = _vars.ConvoApostate_Choices.choice
      delete _vars.ConvoFaithful_Continue
      delete _vars.ConvoApostate_Choices

      if (apostateChoice === "LIFE") {
        Engine.play("ConvoFaithful_Ebi_Life")
      } else if (apostateChoice === "WEATHER") {
        Engine.play("ConvoFaithful_Ebi_Weather")
      } else if (apostateChoice === "MOTHER") {
        Engine.play("ConvoFaithful_Ebi_Mother")
      } else if (apostateChoice === "RENO") {
        Engine.play("ConvoFaithful_Ebi_Reno")
      } else {
        throw `Unknown apostateChoice ${apostateChoice}!`
      }
    }
  }
})()