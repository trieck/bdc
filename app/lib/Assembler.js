/**
 * BDC Assembler class
 */
Ext.define('BDC.lib.Assembler', {
    uses: [ 'BDC.lib.Character' ],
    statics: {
        PROGRAM_SIZE: 100,
        MNEMONICS: {
            halt: 0,     // halt the machine
            j: 0,        // branch unconditionally
            jo: 1,       // branch if overflow
            jno: 2,      // branch unless overflow
            loadi: 3,    // load immediate value to .A
            load: 4,     // load value in memory to .A
            add: 5,      // add value in memory to .A
            sub: 6,      // subtract value in memory from .A
            store: 7,    // copy .A to memory
            inc: 8,      // increment value at memory address
            dec: 9       // decrement value at memory address
        },
        PSEUDO_REGS: [
            'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'
        ]
    },

    memory: [],     // memory to assemble to
    labels: [],     // labels table
    program: '',    // input program
    token: '',      // current input token
    i_index: 0,     // current input index
    o_index: 0,     // current index into memory
    line_no: 0,     // current line number

    /**
     * Initialize assembler
     * @private
     */
    initialize: function () {
        this.memory = new Array(this.self.PROGRAM_SIZE);
        this.labels = [];
        this.i_index = this.o_index = this.line_no;
        this.token = this.program = '';
    },

    constructor: function () {
        this.initialize();
    },

    /**
     * Assemble input program
     * @public
     * @param program
     * @returns assembled program
     */
    assemble: function (program) {
        this.initialize();
        this.program = program.toLowerCase();
        this.parse();
    },

    /**
     * Parse input program
     * @private
     */
    parse: function () {
        var c, length = this.program.length;
        for (this.i_index = 0; this.i_index < length; ++this.i_index) {
            c = this.program[this.i_index];
            switch (c) {
                case ' ':   // token delimiter
                case '\t':
                case '\r':
                    if (this.token.length) {
                        this.instruction();
                        this.token = '';
                    }
                    break;
                case ':':   // label definition
                    this.label();
                    this.token = '';
                    break;
                case ';':   // comment
                    this.comment();
                    this.token = '';
                    break;
                case '\n':
                    this.token = '';
                    this.line_no++;
                    break;
                default:
                    if (BDC.lib.Character.isalnum(c)) {
                        this.token += c;
                    }
                    break;
            }
        }
    },

    /**
     * Generate instruction
     * @private
     */
    instruction: function () {
        var instr;

        if (this.token.length === 0) {
            this.syntax_error();
        }

        if ((instr = this.self.MNEMONICS[this.token]) === undefined) {
            this.syntax_error();
        }

        this.assemble_instr(instr);
    },

    /**
     * Assemble instruction
     * @param instr
     */
    assemble_instr: function (instr) {

    },

    /**
     * Parse comment
     * @private
     */
    comment: function () {
        var c, length = this.program.length;
        for (; this.i_index < length; ++this.i_index) {
            c = this.program[this.i_index];
            if (c === '\n') {
                this.i_index--; // un-read
                return;
            }
        }
    },

    /**
     * Define a label
     * @private
     */
    label: function () {
        if (this.token.length === 0) {
            this.syntax_error();
        }

        if (Ext.Array.contains(this.labels, this.token)) {
            this.error('label already defined.');
        }

        if (Ext.Array.contains(this.self.PSEUDO_REGS, this.token)) {
            this.error('illegal label.');
        }

        this.labels.push({ label: this.token, location: this.o_index});
    },

    /**
     * Throw a syntax error
     */
    syntax_error: function () {
        this.error('syntax error.');
    },

    /**
     * Throw an error with string description
     * @param str
     */
    error: function (str) {
        throw { error: str, line_no: this.line_no };
    }
});
