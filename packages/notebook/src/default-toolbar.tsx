// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import * as React from 'react';

import { DocumentRegistry } from '@jupyterlab/docregistry';

import { Widget } from '@phosphor/widgets';

import { NotebookActions } from './actions';

import {
  showDialog,
  Dialog,
  Toolbar,
  ToolbarButtonComponent,
  UseSignal,
  addToolbarButtonClass,
  ReactWidget,
  ToolbarButton
} from '@jupyterlab/apputils';

import { nbformat } from '@jupyterlab/coreutils';

import { HTMLSelect } from '@jupyterlab/ui-components';

import { NotebookPanel } from './panel';

import { Notebook } from './widget';

/**
 * The class name added to toolbar save button.
 */
const TOOLBAR_SAVE_CLASS = 'jp-SaveIcon';

const X_UNDO = 'x-Undo';
const X_REDO = 'x-Redo';
const X_UNDO_CELL = 'x-Undo-Cell';
const X_REDO_CELL = 'x-Redo_Cell';
const X_TOGGLE_NUMBERING = 'x-Toggle-Numbering';
const X_CLEAR_OUTPUT = 'x-Clear-Output';
const X_CLEAR_ALL_OUTPUT = 'x-Clear-All-Output';
const X_SPLIT = 'x-Split';
const X_MERGE = 'x-Merge';
const X_SHOW_CODE = 'x-Show-Code';
const X_HIDE_CODE = 'x-Hide-Code';
const X_SHOW_ALL_CODE = 'x-Show-All-Code';
const X_HIDE_ALL_CODE = 'x-Hide-All-Code';
const X_SHOW_OUTPUT = 'x-Show-Output';
const X_HIDE_OUTPUT = 'x-Hide-Output';
const X_SHOW_ALL_OUTPUT = 'x-Show-All-Output';
const X_HIDE_ALL_OUTPUT = 'x-Hide-All-Output';

const X_SELECT_ALL = 'x-Select-All';
const X_DESELECT_ALL = 'x-Deselect-All';
const X_MOVE_UP = 'x-Move-Up';
const X_MOVE_DOWN = 'x-Move-Down';
const X_DELETE = 'x-Delete';

/**
 * The class name added to toolbar insert button.
 */
const TOOLBAR_INSERT_CLASS = 'jp-AddIcon';

/**
 * The class name added to toolbar cut button.
 */
const TOOLBAR_CUT_CLASS = 'jp-CutIcon';

/**
 * The class name added to toolbar copy button.
 */
const TOOLBAR_COPY_CLASS = 'jp-CopyIcon';

/**
 * The class name added to toolbar paste button.
 */
const TOOLBAR_PASTE_CLASS = 'jp-PasteIcon';

/**
 * The class name added to toolbar run button.
 */
const TOOLBAR_RUN_CLASS = 'jp-RunIcon';

/**
 * The class name added to toolbar cell type dropdown wrapper.
 */
const TOOLBAR_CELLTYPE_CLASS = 'jp-Notebook-toolbarCellType';

/**
 * The class name added to toolbar cell type dropdown.
 */
const TOOLBAR_CELLTYPE_DROPDOWN_CLASS = 'jp-Notebook-toolbarCellTypeDropdown';

/**
 * A namespace for the default toolbar items.
 */
export namespace ToolbarItems {
  /**
   * Create save button toolbar item.
   */
  export function createSaveButton(panel: NotebookPanel): Widget {
    function onClick() {
      if (panel.context.model.readOnly) {
        return showDialog({
          title: 'Cannot Save',
          body: 'Document is read-only',
          buttons: [Dialog.okButton()]
        });
      }
      void panel.context.save().then(() => {
        if (!panel.isDisposed) {
          return panel.context.createCheckpoint();
        }
      });
    }
    return addToolbarButtonClass(
      ReactWidget.create(
        <UseSignal signal={panel.context.fileChanged}>
          {() => (
            <ToolbarButtonComponent
              iconClassName={TOOLBAR_SAVE_CLASS}
              onClick={onClick}
              tooltip="Save the notebook contents and create checkpoint"
              enabled={
                !!(
                  panel &&
                  panel.context &&
                  panel.context.contentsModel &&
                  panel.context.contentsModel.writable
                )
              }
            />
          )}
        </UseSignal>
      )
    );
  }

  /**
   * Create an insert toolbar item.
   */
  export function createInsertButton(panel: NotebookPanel): Widget {
    return new ToolbarButton({
      iconClassName: TOOLBAR_INSERT_CLASS,
      onClick: () => {
        NotebookActions.insertBelow(panel.content);
      },
      tooltip: 'Insert a cell below'
    });
  }

  /**
   * Create an insert undo operation toolbar item.
   */
  export function createUndoOperationButton(panel: NotebookPanel): Widget {
    return new ToolbarButton({
      iconClassName: X_UNDO,
      onClick: () => {
        panel.content.activeCell.editor.undo();
      },
      tooltip: 'Undo Operation Button'
    });
  }

  /**
   * Create an insert redo operation toolbar item.
   */
  export function createRedoOperationButton(panel: NotebookPanel): Widget {
    return new ToolbarButton({
      iconClassName: X_REDO,
      onClick: () => {
        panel.content.activeCell.editor.redo();
      },
      tooltip: 'Redo Operation Button'
    });
  }

  /**
   * Create an insert undo cell operation toolbar item.
   */
  export function createUndoCellOperationButton(panel: NotebookPanel): Widget {
    return new ToolbarButton({
      iconClassName: X_UNDO_CELL,
      onClick: () => {
        NotebookActions.undo(panel.content);
      },
      tooltip: 'Undo Cell Operation Button'
    });
  }

  /**
   * Create an insert redo cell operation toolbar item.
   */
  export function createRedoCellOperationButton(panel: NotebookPanel): Widget {
    return new ToolbarButton({
      iconClassName: X_REDO_CELL,
      onClick: () => {
        NotebookActions.redo(panel.content);
      },
      tooltip: 'Redo Cell Operation Button'
    });
  }

  /**
   * Create an insert select all cell operation toolbar item.
   */
  export function createSelectAllCellOperationButton(
    panel: NotebookPanel
  ): Widget {
    return new ToolbarButton({
      iconClassName: X_SELECT_ALL,
      onClick: () => {
        NotebookActions.selectAll(panel.content);
      },
      tooltip: 'Select All Cell Operation Button'
    });
  }

  /**
   * Create an insert deselect all cell operation toolbar item.
   */
  export function createDeselectAllCellOperationButton(
    panel: NotebookPanel
  ): Widget {
    return new ToolbarButton({
      iconClassName: X_DESELECT_ALL,
      onClick: () => {
        NotebookActions.deselectAll(panel.content);
      },
      tooltip: 'Deselect All Cell Operation Button'
    });
  }

  /**
   * Create an insert delete cell operation toolbar item.
   */
  export function createDeleteCellsOperationButton(
    panel: NotebookPanel
  ): Widget {
    return new ToolbarButton({
      iconClassName: X_DELETE,
      onClick: () => {
        NotebookActions.deleteCells(panel.content);
      },
      tooltip: 'Delete Selected Cell Operation Button'
    });
  }

  /**
   * Create an insert move up cell operation toolbar item.
   */
  export function createMoveUpCellsOperationButton(
    panel: NotebookPanel
  ): Widget {
    return new ToolbarButton({
      iconClassName: X_MOVE_UP,
      onClick: () => {
        NotebookActions.moveUp(panel.content);
      },
      tooltip: 'Move Up Selected Cell Operation Button'
    });
  }

  /**
   * Create an insert move down cell operation toolbar item.
   */
  export function createMoveDownCellsOperationButton(
    panel: NotebookPanel
  ): Widget {
    return new ToolbarButton({
      iconClassName: X_MOVE_DOWN,
      onClick: () => {
        NotebookActions.moveDown(panel.content);
      },
      tooltip: 'Move Down Selected Cell Operation Button'
    });
  }

  /**
   * Create an insert split cell operation toolbar item.
   */
  export function createSplitCellsOperationButton(
    panel: NotebookPanel
  ): Widget {
    return new ToolbarButton({
      iconClassName: X_SPLIT,
      onClick: () => {
        NotebookActions.splitCell(panel.content);
      },
      tooltip: 'Split Selected Cell Operation Button'
    });
  }

  /**
   * Create an insert merge cell operation toolbar item.
   */
  export function createMergeCellsOperationButton(
    panel: NotebookPanel
  ): Widget {
    return new ToolbarButton({
      iconClassName: X_MERGE,
      onClick: () => {
        NotebookActions.mergeCells(panel.content);
      },
      tooltip: 'Merge Selected Cell Operation Button'
    });
  }

  /**
   * Create an insert clear Outputs operation toolbar item.
   */
  export function creatClearOutputOperationButton(
    panel: NotebookPanel
  ): Widget {
    return new ToolbarButton({
      iconClassName: X_CLEAR_OUTPUT,
      onClick: () => {
        NotebookActions.clearOutputs(panel.content);
      },
      tooltip: 'Clear Output Operation Button'
    });
  }

  /**
   * Create an insert clear All Outputs operation toolbar item.
   */
  export function creatClearAllOutputOperationButton(
    panel: NotebookPanel
  ): Widget {
    return new ToolbarButton({
      iconClassName: X_CLEAR_ALL_OUTPUT,
      onClick: () => {
        NotebookActions.clearAllOutputs(panel.content);
      },
      tooltip: 'Clear All Output Operation Button'
    });
  }

  /**
   * Create an hide code operation toolbar item.
   */
  export function creatHideCodeOperationButton(panel: NotebookPanel): Widget {
    return new ToolbarButton({
      iconClassName: X_HIDE_CODE,
      onClick: () => {
        NotebookActions.hideCode(panel.content);
      },
      tooltip: 'Hide Code Operation Button'
    });
  }

  /**
   * Create an hide all code operation toolbar item.
   */
  export function creatHideAllCodeOperationButton(
    panel: NotebookPanel
  ): Widget {
    return new ToolbarButton({
      iconClassName: X_HIDE_ALL_CODE,
      onClick: () => {
        NotebookActions.hideAllCode(panel.content);
      },
      tooltip: 'Hide All code Operation Button'
    });
  }

  /**
   * Create an show code operation toolbar item.
   */
  export function creatShowCodeOperationButton(panel: NotebookPanel): Widget {
    return new ToolbarButton({
      iconClassName: X_SHOW_CODE,
      onClick: () => {
        NotebookActions.showCode(panel.content);
      },
      tooltip: 'Show Code Operation Button'
    });
  }

  /**
   * Create an show all code operation toolbar item.
   */
  export function creatShowAllCodeOperationButton(
    panel: NotebookPanel
  ): Widget {
    return new ToolbarButton({
      iconClassName: X_SHOW_ALL_CODE,
      onClick: () => {
        NotebookActions.showAllCode(panel.content);
      },
      tooltip: 'Show All code Operation Button'
    });
  }

  /**
   * Create an hide output operation toolbar item.
   */
  export function creatHideOutputOperationButton(panel: NotebookPanel): Widget {
    return new ToolbarButton({
      iconClassName: X_HIDE_OUTPUT,
      onClick: () => {
        NotebookActions.hideOutput(panel.content);
      },
      tooltip: 'Hide Output Operation Button'
    });
  }

  /**
   * Create an hide all output operation toolbar item.
   */
  export function creatHideAllOutputOperationButton(
    panel: NotebookPanel
  ): Widget {
    return new ToolbarButton({
      iconClassName: X_HIDE_ALL_OUTPUT,
      onClick: () => {
        NotebookActions.hideAllOutputs(panel.content);
      },
      tooltip: 'Hide All Output Operation Button'
    });
  }

  /**
   * Create an show output operation toolbar item.
   */
  export function creatShowOutputOperationButton(panel: NotebookPanel): Widget {
    return new ToolbarButton({
      iconClassName: X_SHOW_OUTPUT,
      onClick: () => {
        NotebookActions.showOutput(panel.content);
      },
      tooltip: 'show Output Operation Button'
    });
  }

  /**
   * Create an show all output operation toolbar item.
   */
  export function creatshowAllOutputOperationButton(
    panel: NotebookPanel
  ): Widget {
    return new ToolbarButton({
      iconClassName: X_SHOW_ALL_OUTPUT,
      onClick: () => {
        NotebookActions.showAllOutputs(panel.content);
      },
      tooltip: 'show All Output Operation Button'
    });
  }

  /**
   * Create an toggle numbering operation toolbar item.
   */
  export function creatToggleNumberingOperationButton(
    panel: NotebookPanel
  ): Widget {
    return new ToolbarButton({
      iconClassName: X_TOGGLE_NUMBERING,
      onClick: () => {
        NotebookActions.toggleAllLineNumbers(panel.content);
      },
      tooltip: 'Toggle All Numbering Operation Button'
    });
  }

  /**
   * Create a cut toolbar item.
   */
  export function createCutButton(panel: NotebookPanel): Widget {
    return new ToolbarButton({
      iconClassName: TOOLBAR_CUT_CLASS,
      onClick: () => {
        NotebookActions.cut(panel.content);
      },
      tooltip: 'Cut the selected cells'
    });
  }

  /**
   * Create a copy toolbar item.
   */
  export function createCopyButton(panel: NotebookPanel): Widget {
    return new ToolbarButton({
      iconClassName: TOOLBAR_COPY_CLASS,
      onClick: () => {
        NotebookActions.copy(panel.content);
      },
      tooltip: 'Copy the selected cells'
    });
  }

  /**
   * Create a paste toolbar item.
   */
  export function createPasteButton(panel: NotebookPanel): Widget {
    return new ToolbarButton({
      iconClassName: TOOLBAR_PASTE_CLASS,
      onClick: () => {
        NotebookActions.paste(panel.content);
      },
      tooltip: 'Paste cells from the clipboard'
    });
  }

  /**
   * Create a run toolbar item.
   */
  export function createRunButton(panel: NotebookPanel): Widget {
    return new ToolbarButton({
      iconClassName: TOOLBAR_RUN_CLASS,
      onClick: () => {
        void NotebookActions.runAndAdvance(panel.content, panel.session);
      },
      tooltip: 'Run the selected cells and advance'
    });
  }

  /**
   * Create a cell type switcher item.
   *
   * #### Notes
   * It will display the type of the current active cell.
   * If more than one cell is selected but are of different types,
   * it will display `'-'`.
   * When the user changes the cell type, it will change the
   * cell types of the selected cells.
   * It can handle a change to the context.
   */
  export function createCellTypeItem(panel: NotebookPanel): Widget {
    return new CellTypeSwitcher(panel.content);
  }

  /**
   * Get the default toolbar items for panel
   */
  export function getDefaultItems(
    panel: NotebookPanel
  ): DocumentRegistry.IToolbarItem[] {
    return [
      { name: 'save', widget: createSaveButton(panel) },
      { name: 'insert', widget: createInsertButton(panel) },
      { name: 'cut', widget: createCutButton(panel) },
      { name: 'copy', widget: createCopyButton(panel) },
      {
        name: 'undoOperation',
        widget: createUndoOperationButton(panel)
      },
      {
        name: 'redoOperation',
        widget: createRedoOperationButton(panel)
      },
      {
        name: 'undoCellOperation',
        widget: createUndoCellOperationButton(panel)
      },
      {
        name: 'redoCellOperation',
        widget: createRedoCellOperationButton(panel)
      },
      {
        name: 'selectAllCellOperation',
        widget: createSelectAllCellOperationButton(panel)
      },
      {
        name: 'deselectAllCellOperation',
        widget: createDeselectAllCellOperationButton(panel)
      },
      {
        name: 'deletCellsOperation',
        widget: createDeleteCellsOperationButton(panel)
      },
      {
        name: 'moveUpCell',
        widget: createMoveUpCellsOperationButton(panel)
      },
      {
        name: 'moveDownCell',
        widget: createMoveDownCellsOperationButton(panel)
      },
      {
        name: 'splitCell',
        widget: createSplitCellsOperationButton(panel)
      },
      {
        name: 'mergeCell',
        widget: createMergeCellsOperationButton(panel)
      },
      {
        name: 'clearOutput',
        widget: creatClearOutputOperationButton(panel)
      },
      {
        name: 'clearAllOutput',
        widget: creatClearAllOutputOperationButton(panel)
      },
      {
        name: 'showCode',
        widget: creatShowCodeOperationButton(panel)
      },
      {
        name: 'hideCode',
        widget: creatHideCodeOperationButton(panel)
      },
      {
        name: 'showAllCode',
        widget: creatShowAllCodeOperationButton(panel)
      },
      {
        name: 'hideAllCode',
        widget: creatHideAllCodeOperationButton(panel)
      },
      {
        name: 'showOutput',
        widget: creatShowOutputOperationButton(panel)
      },
      {
        name: 'hideOutput',
        widget: creatHideOutputOperationButton(panel)
      },
      {
        name: 'showAllOutput',
        widget: creatshowAllOutputOperationButton(panel)
      },
      {
        name: 'hideAllOutput',
        widget: creatHideAllOutputOperationButton(panel)
      },
      {
        name: 'toggleNumbering',
        widget: creatToggleNumberingOperationButton(panel)
      },
      { name: 'paste', widget: createPasteButton(panel) },
      { name: 'run', widget: createRunButton(panel) },
      {
        name: 'interrupt',
        widget: Toolbar.createInterruptButton(panel.session)
      },
      {
        name: 'restart',
        widget: Toolbar.createRestartButton(panel.session)
      },
      { name: 'cellType', widget: createCellTypeItem(panel) },
      { name: 'spacer', widget: Toolbar.createSpacerItem() },
      {
        name: 'kernelName',
        widget: Toolbar.createKernelNameItem(panel.session)
      },
      {
        name: 'kernelStatus',
        widget: Toolbar.createKernelStatusItem(panel.session)
      }
    ];
  }
}

/**
 * A toolbar widget that switches cell types.
 */
export class CellTypeSwitcher extends ReactWidget {
  /**
   * Construct a new cell type switcher.
   */
  constructor(widget: Notebook) {
    super();
    this.addClass(TOOLBAR_CELLTYPE_CLASS);
    this._notebook = widget;
    if (widget.model) {
      this.update();
    }
    widget.activeCellChanged.connect(this.update, this);
    // Follow a change in the selection.
    widget.selectionChanged.connect(this.update, this);
  }

  /**
   * Handle `change` events for the HTMLSelect component.
   */
  handleChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    if (event.target.value !== '-') {
      NotebookActions.changeCellType(this._notebook, event.target
        .value as nbformat.CellType);
      this._notebook.activate();
    }
  };

  /**
   * Handle `keydown` events for the HTMLSelect component.
   */
  handleKeyDown = (event: React.KeyboardEvent): void => {
    if (event.keyCode === 13) {
      this._notebook.activate();
    }
  };

  render() {
    let value = '-';
    if (this._notebook.activeCell) {
      value = this._notebook.activeCell.model.type;
    }
    for (let widget of this._notebook.widgets) {
      if (this._notebook.isSelectedOrActive(widget)) {
        if (widget.model.type !== value) {
          value = '-';
          break;
        }
      }
    }
    return (
      <HTMLSelect
        className={TOOLBAR_CELLTYPE_DROPDOWN_CLASS}
        onChange={this.handleChange}
        onKeyDown={this.handleKeyDown}
        value={value}
        iconProps={{
          icon: <span className="jp-MaterialIcon jp-DownCaretIcon bp3-icon" />
        }}
        aria-label="Cell type"
        minimal
      >
        <option value="-">-</option>
        <option value="code">Code</option>
        <option value="markdown">Markdown</option>
        <option value="raw">Raw</option>
      </HTMLSelect>
    );
  }

  private _notebook: Notebook = null;
}
