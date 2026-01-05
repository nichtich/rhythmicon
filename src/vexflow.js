import { Factory, StaveNote, Voice } from "vexflow"

function splitNotesIntoMeasures(factory, rhythm) {
  const measureLength = beats * 8 / beatValue // quarters per measure
  console.log(measureLength)
  const measures = []
  let current = []
  for (let i=0; i<rhythm.length; i++) {
    // TODO: 
    const note = factory.StaveNote({
      keys: ["b/4"],
      type: rhythm[i] ? "n" : "r", // TODO: use "s" for slash notes
      duration: "8",
    })
    current.push(note)
    if (current.length == measureLength) {
      measures.push(current)
      current = []
    }
  }

  if (current.length) {
    measures.push(current)
  }
  return measures
}


export function renderScore(elementId, rhythm, { width, height }) {
  document.getElementById(elementId).innerHTML = ""
  //  container.value.innerHTML = ""
  const margin = 10
  const factory = new Factory({ renderer: { elementId, width, height } })

  let time = []
  if (rhythm.length <= 4) {
    time = [rhythm.length, 4]
  } else if (rhythm.length <= 8) {
    time = [rhythm.length, 8]
  } else {
    console.log("rhythm too long")
    return
  }

  // TODO: multiple systems if length > 8
  const system = factory.System({ width: width - 2*margin })

  const notes = rhythm.map(beat => factory.StaveNote({
    keys: ["b/4"],
    duration: `${time[1]}`,
    type: beat ? "n" : "r",
  }))

  const measures = [ notes  ]

  // TODO: one system per measure!
  for (let i=0; i<measures.length; i++) {
    // const notes = measures[i]

    const voice = factory.Voice()
    voice.setMode(Voice.Mode.SOFT)
    voice.addTickables(notes)
    const stave = system.addStave({ voices: [voice] })
    stave.setConfigForLines([0,0,1,0,0].map(visible => ({ visible })))
    //.setEndBarType(1) // TODO

    if (!i) {
      stave.addClef("percussion")
      stave.addTimeSignature(time.join("/"))
    } 
    if (i == measures.length - 1) {
      stave.setEndBarType(i == measures.length - 1 ? 5 : 0)
    }
  }

  factory.draw()

  notes.forEach((note, i) =>
    note.getSVGElement().setAttribute("class", `pulse-${i}`))
}
