/**
 * BDC Assembler class
 */
Ext.define('BDC.lib.Assembler', {
    uses: [ 'BDC.lib.Character' ],
    statics: {
        PROGRAM_SIZE: 100,
        MNEMONICS: {
            halt: -1,   // halt the machine
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

        PSEUDO_REGS: {
            q: 80,
            r: 82,
            s: 84,
            t: 86,
            u: 88,
            v: 90,
            w: 92,
            x: 94,
            y: 96,
            z: 98
        }
    },

    memory: [],     // memory to assemble to
    symbols: {},    // symbol table
    refs: [],       // forward reference list
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
        this.memory = Array.apply(null, new Array(this.self.PROGRAM_SIZE)).map(Number.prototype.valueOf, 0);
        this.symbols = {};
        this.refs = [];
        this.i_index = this.o_index = 0;
        this.line_no = 1;
        this.token = this.program = '';
    },

    constructor: function () {
        this.initialize();
    },

    /**
     * Assemble input program
     * @public
     * @param program
     * @returns {Array} assembled program
     */
    assemble: function (program) {
        this.initialize();
        this.program = program.toLowerCase();
        this.parse();
        this.resolve();
        return this.memory;
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
     * Resolve forward references
     * @private
     */
    resolve: function () {

        Ext.each(this.refs, function (ref) {
            var value, message;
            if ((value = this.symbols[ref.name]) === undefined) {
                message = Ext.String.format('can\'t find label {0}.', ref.name);
                throw { error: message, line_no: ref.line_no };
            }
            // calculate real offset
            value = value - ref.location - 3;
            value = ((value % this.self.PROGRAM_SIZE) + this.self.PROGRAM_SIZE) % this.self.PROGRAM_SIZE;
            this.memory[ref.location] = value % 10;
            this.memory[ref.location + 1] = Math.floor(value / 10);
        }, this);
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
                case ' ':   // whitespace delimiter
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
                case '\n':  // new line
                    this.line_no++;
                    if (this.token.length) {
                        return tt;
                    }
                    break;
                default:
                    if (BDC.lib.Character.isdigit(c)) {
                        if (tt === this.self.TT_EMPTY) {
                            tt = this.self.TT_NUMBER;
                        }
                        this.token += c;
                        continue;
                    } else if (BDC.lib.Character.isalpha(c)) {
                        tt = this.self.TT_ID;
                        this.token += c;
                        continue;
                    } else {
                        this.syntax_error();
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
            case this.self.MNEMONICS.halt:  // halt
                this.halt();
                break;
            case this.self.MNEMONICS.j:     // branch
                this.jump();
                break;
            case this.self.MNEMONICS.jo:    // branch on overflow
                this.jo();
                break;
            case this.self.MNEMONICS.jno:    // branch unless overflow
                this.jno();
                break;
            case this.self.MNEMONICS.loadi: // load immediate
                this.loadi();
                break;
            case this.self.MNEMONICS.load:  // load value in memory to accumulator
                this.load();
                break;
            case this.self.MNEMONICS.add:   // add value in memory to accumulator
                this.add();
                break;
            case this.self.MNEMONICS.sub:   // subtract value in memory from accumulator
                this.sub();
                break;
            case this.self.MNEMONICS.store: // store accumulator to memory
                this.store();
                break;
            case this.self.MNEMONICS.inc:   // increment value in memory
                this.inc();
                break;
            case this.self.MNEMONICS.dec:   // decremement value in memory
                this.dec();
                break;
        }
    },

    /**
     * Assemble value
     * @param value
     * @private
     */
    assemble_val: function (value) {
        this.memory[this.o_index++] = value % 10;
        this.memory[this.o_index++] = Math.floor(value / 10);
    },

    /**
     * Halt
     * @private
     */
    halt: function () {
        this.assemble_val(0);
        this.memory[this.o_index++] = this.self.MNEMONICS.j;
    },

    /**
     * Jump
     * @private
     */
    jump: function () {
        var value = this.getLocation();
        this.assemble_val(value);
        this.memory[this.o_index++] = this.self.MNEMONICS.j;
    },

    /**
     * Jump if overflow set
     * @private
     */
    jo: function () {
        var value = this.getLocation();
        this.assemble_val(value);
        this.memory[this.o_index++] = this.self.MNEMONICS.jo;
    },

    /**
     * Jump unless overflow set
     * @private
     */
    jno: function () {
        var value = this.getLocation();
        this.assemble_val(value);
        this.memory[this.o_index++] = this.self.MNEMONICS.jno;
    },


    /**
     * Load memory to accumulator
     * @private
     */
    load: function () {
        var value = this.getAbsolute();
        this.assemble_val(value);
        this.memory[this.o_index++] = this.self.MNEMONICS.load;
    },

    /**
     * Load immediate value to accumulator
     * @private
     */
    loadi: function () {
        var value = this.getImmediate();
        this.assemble_val(value);
        this.memory[this.o_index++] = this.self.MNEMONICS.loadi;
    },

    /**
     * Store accumulator to memory
     * @private
     */
    store: function () {
        var value = this.getAbsolute();
        this.assemble_val(value);
        this.memory[this.o_index++] = this.self.MNEMONICS.store;
    },

    /**
     * Add value in memory to accumulator
     * @private
     */
    add: function () {
        var value = this.getAbsolute();
        this.assemble_val(value);
        this.memory[this.o_index++] = this.self.MNEMONICS.add;
    },

    /**
     * Subtract value in memory from accumulator
     * @private
     */
    sub: function () {
        var value = this.getAbsolute();
        this.assemble_val(value);
        this.memory[this.o_index++] = this.self.MNEMONICS.sub;
    },

    /**
     * Increment a value in memory
     * @private
     */
    inc: function () {
        var value = this.getAbsolute();
        this.assemble_val(value);
        this.memory[this.o_index++] = this.self.MNEMONICS.inc;
    },

    /**
     * Decrement a value in memory
     * @private
     */
    dec: function () {
        var value = this.getAbsolute();
        this.assemble_val(value);
        this.memory[this.o_index++] = this.self.MNEMONICS.dec;
    },

    /**
     * Get immediate value
     * @private
     * @returns {Number}
     */
    getImmediate: function () {
        var tt = this.getToken();
        if (tt !== this.self.TT_NUMBER)
            this.syntax_error();

        return this.parseValue();
    },

    /**
     * Parse token value
     * @returns {Number}
     */
    parseValue: function () {
        var value = parseInt(this.token, 10);
        if (isNaN(value)) {
            this.syntax_error();
        }

        if (0 > value || value > 99)
            this.error('number out of range.');

        return value;
    },

    /**
     * Get absolute value
     * @private
     * @return {Number}
     */
    getAbsolute: function () {
        var value, tt = this.getToken();
        if (tt !== this.self.TT_NUMBER && tt !== this.self.TT_ID) {
            this.syntax_error();
        }

        if (tt === this.self.TT_NUMBER) {
            return this.parseValue();
        }

        if ((value = this.self.PSEUDO_REGS[this.token]) === undefined) {
            this.error('undefined symbol');
        }

        return value;
    },

    /**
     * Get memory location or symbol table value
     */
    getLocation: function () {
        var value, tt = this.getToken();
        if (tt !== this.self.TT_NUMBER && tt !== this.self.TT_ID)
            this.syntax_error();

        if (tt === this.self.TT_NUMBER)
            return this.parseValue();

        if ((value = this.symbols[this.token]) !== undefined) {
            // calculate real offset
            value = ((this.self.PROGRAM_SIZE - this.o_index) + value) - 3;
            value = ((value % this.self.PROGRAM_SIZE) + this.self.PROGRAM_SIZE) % this.self.PROGRAM_SIZE;
            return value;
        }

        // undefined, generate a forward reference
        this.refs.push({ name: this.token, location: this.o_index, line_no: this.line_no });

        return 0;
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

        // can't re-define a label
        if (this.symbols[this.token] !== undefined) {
            this.error('label already defined.');
        }

        // can't be a pseudo register
        if (this.self.PSEUDO_REGS[this.token] !== undefined) {
            this.error('illegal label.');
        }

        this.symbols[this.token] = this.o_index;
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
