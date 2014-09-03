/**
 * BDC Assembler class
 */
Ext.define('BDC.lib.Assembler', {
    uses: [ 'BDC.lib.Character' ],
    statics: {
        PROGRAM_SIZE: 100,
        MNEMONICS: {
            halt: 0,    // halt the machine
            j: 0,       // branch unconditionally
            jo: 1,      // branch if overflow
            jno: 2,     // branch unless overflow
            loadi: 3,   // load immediate value to .A
            load: 4,    // load value in memory to .A
            add: 5,     // add value in memory to .A
            sub: 6,     // subtract value in memory from .A
            store: 7,   // copy .A to memory
            inc: 8,     // increment value at memory address
            dec: 9      // decrement value at memory address
        },

        TT_EMPTY: 0,    // empty token
        TT_ID: 1,       // identifier token
        TT_NUMBER: 2,   // numeric token
        TT_LABEL: 3,    // label token

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
        this.i_index = 0;
        var tt;

        while ((tt = this.getToken()) !== this.self.TT_EMPTY) {
            switch (tt) {
                case this.self.TT_LABEL:    // label definition
                    this.label();
                    break;
                case this.self.TT_ID:       // instruction
                    this.instruction();
                    break;
                default:                    // error
                    this.syntax_error();
                    break;
            }
        }
    },

    /**
     * Get next token from input
     * @private
     */
    getToken: function () {
        var c, length = this.program.length;
        var tt = this.self.TT_EMPTY;

        for (this.token = ''; this.i_index < length; ++this.i_index) {
            c = this.program[this.i_index];
            switch (c) {
                case ' ':   // token delimiter
                case '\t':
                case '\r':
                    if (this.token.length) {
                        return tt;
                    }
                    break;
                case ':':   // label definition
                    if (this.token.length) {
                        return this.self.TT_LABEL;
                    }
                    break;
                case ';':   // comment
                    this.comment(); // eat
                    break;
                case '\n':
                    this.line_no++;
                    if (this.token.length) {
                        return tt;
                    }
                    break;
                default:
                    if (BDC.lib.Character.isdigit(c)) {
                        tt = this.self.TT_NUMBER;
                        this.token += c;
                    }
                    if (BDC.lib.Character.isalpha(c)) {
                        tt = this.self.TT_ID;
                        this.token += c;
                    }
                    break;
            }
        }

        return tt;
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
        switch (instr) {
            case this.self.MNEMONICS.loadi:   // load immediate
                this.load_immediate();
                break;
            case this.self.MNEMONICS.store: // store accumulator to memory
                this.store();
                break;
        }
    },

    /**
     * Load immediate
     */
    load_immediate: function () {
        var value = this.getValue();
        this.memory[this.o_index++] = this.self.MNEMONICS.loadi;
        this.memory[this.o_index++] = value % 10;
        this.memory[this.o_index++] = value / 10;
    },

    /**
     * Store accumulator to memory
     * @private
     */
    store: function () {

    },

    /**
     * Get 1 or 2 digit value
     */
    getValue: function () {
        var value, tt = this.getToken();
        if (tt !== this.self.TT_NUMBER)
            this.syntax_error();

        value = parseInt(this.token, 10);
        if (isNaN(value)) {
            this.syntax_error();
        }

        if (0 > value || value > 99)
            this.error('number out of range.');

        return value;
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

        // FIXME:
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
