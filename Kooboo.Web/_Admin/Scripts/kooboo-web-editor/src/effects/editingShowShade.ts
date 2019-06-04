import context from "../context";
import { SelectedDomEventArgs } from "../events/selectedDomEvent";
import { EditorShade } from "../models/editorShade";

export default (document: Document) => {
  const editorShade = new EditorShade(document);

  context.tinymceDisplayEvent.addEventListener(e => {
    if (e) {
      editorShade.updateSource(context.lastSelectedDomEventArgs!.closeElement);
    } else {
      editorShade.clear(document);
    }
  });

  context.tinymceInputEvent.addEventListener(() => {
    editorShade.updateSource(context.lastSelectedDomEventArgs!.closeElement);
  });
};
