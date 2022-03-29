(function() {
  const _setup = setup as any

  _setup.Route_ConvoApostate_Receiver = function() {
    const _vars = State.variables as any;

    if (_vars.ConvoApostate_Continue && _vars.ConvoFaithful_Choices) {
      const faithfulChoice = _vars.ConvoFaithful_Choices.choice
      delete _vars.ConvoApostate_Continue
      delete _vars.ConvoFaithful_Choices

      if (faithfulChoice === "IMPLANTS") {
        Engine.play("ConvoApostate_Jeku_Implants")
      } else if (faithfulChoice === "FIANCEE") {
        Engine.play("ConvoApostate_Jeku_Fiancee")
      } else if (faithfulChoice === "LIFE") {
        Engine.play("ConvoApostate_Jeku_Life")
      } else if (faithfulChoice === "CHILDHOOD") {
        Engine.play("ConvoApostate_Jeku_Childhood")
      } else {
        throw `Unknown apostateChoice ${faithfulChoice}!`
      }
    }
  }

  _setup.Complete_ConvoApostate_Ebi_Life = function() {
    const _vars = State.variables as any

    if (_vars.ConvoApostate_Ebi_Life && _vars.ConvoFaithful_Ebi_Life) {
      const faithfulChoice = _vars.ConvoFaithful_Ebi_Life.choice
      delete _vars.ConvoApostate_Ebi_Life
      delete _vars.ConvoFaithful_Ebi_Life

      if (faithfulChoice === "CORPORATE") {
        Engine.play("ConvoApostate_Ebi_Life_Corporate")
      } else if (faithfulChoice === "COSMETIC") {
        Engine.play("ConvoApostate_Ebi_Life_Cosmetic")
      } else if (faithfulChoice === "SLUM") {
        Engine.play("ConvoApostate_Ebi_Life_Slum")
      }
    }
  }
})()