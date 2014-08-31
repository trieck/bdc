/*
Copyright(c) 2012 Michael Q. Rieck, Thomas A. Rieck
*/
Ext.define("BDC.lib.ButtonsPanel",{extend:"Ext.panel.Panel",alias:"widget.buttons-panel",layout:{type:"vbox",align:"center"},columnWidth:0.2,height:350,title:"Options",padding:"10px",items:[{xtype:"component",flex:0.5},{xtype:"button",tooltip:{text:"Step the machine"},text:"STEP",focusCls:"",id:"stepButton",iconCls:"step-icon",iconAlign:"top",width:"80%",flex:0.6},{xtype:"component",flex:0.5},{xtype:"button",tooltip:{text:"Reset the machine"},text:"RESET",focusCls:"",id:"resetButton",iconCls:"reset-icon",iconAlign:"top",width:"80%",flex:0.6},{xtype:"component",flex:0.5},{xtype:"button",tooltip:{text:"Save the machine state"},text:"SAVE",disabled:true,focusCls:"",id:"saveButton",iconCls:"save-icon",iconAlign:"top",width:"80%",flex:0.6},{xtype:"component",flex:0.1},{xtype:"button",tooltip:{text:"Load program to the machine"},text:"LOAD",focusCls:"",id:"loadButton",iconCls:"load-icon",iconAlign:"top",width:"80%",flex:0.6,menu:{items:[{text:"Multiply x and y",id:"programOne",iconCls:"tape-icon"},{text:"Divide x by y",id:"programTwo",iconCls:"tape-icon"},{text:"Add numbers from x up to y",id:"programThree",iconCls:"tape-icon"},{text:"Generate Fibonacci numbers",id:"programFour",iconCls:"tape-icon"},{text:"Compute base-2 Logarithm of x",id:"programFive",iconCls:"tape-icon"},{text:"Add data in array",id:"programSix",iconCls:"tape-icon"}]}},{xtype:"component",flex:1}]});Ext.define("BDC.lib.MemoryPanel",{extend:"Ext.panel.Panel",alias:"widget.memory-panel",title:"Main Memory",uses:["BDC.lib.Colors"],columnWidth:0.6,height:350,layout:{type:"table",columns:11},padding:"10px",initComponent:function(){var b,a;this.callParent(arguments);for(b=0;b<11;++b){if(b===0){this.add({xtype:"panel",border:false,width:60})}else{this.add({xtype:"text",fieldCls:"memory-bold-cell",text:""+(b-1),padding:"2 5 25 11"})}}for(b=0,a=0;b<100;++b){if(b%10===0){this.add({xtype:"text",fieldCls:"memory-bold-cell",text:""+a++,padding:"0 0 0 10"})}this.add({xtype:"textfield",minLength:1,maxLength:1,fieldCls:"memory-cell",selectOnFocus:true,emptyText:"0",width:25,itemId:"memory-cell-"+b,margin:"2px"})}},getMemoryCells:function(){return this.query("textfield[itemId^=memory-cell]")},clear:function(){var a=this.getMemoryCells();Ext.each(a,function(b){b.reset();b.setFieldStyle("color: darkgrey;");b.setValue("0")});this.highlightInstruction(0,BDC.lib.Colors.MAGENTA)},getCell:function(c,b){var a=(c%10)*10+(b%10);var d=Ext.String.format("memory-cell-{0}",a);return this.getComponent(d)},highlightInstruction:function(b,a){var d,c;c=Math.floor(b/10);d=b%10;this.highlight(c,d,a);b=(b+1)%100;c=Math.floor(b/10);d=b%10;this.highlight(c,d,a);b=(b+1)%100;c=Math.floor(b/10);d=b%10;this.highlight(c,d,a)},highlight:function(d,c,b){var a=this.getCell(d,c);var e=Ext.String.format("color: #{0};",b);a.setFieldStyle(e)},resetGray:function(){var a=this.getMemoryCells();Ext.each(a,function(b){b.setFieldStyle("color: darkgrey;")})},getCellValue:function(c,b){var a=this.getCell(c,b);return a.getValue()%10},getNCellValue:function(c){var b,a;b=Math.floor(c/10)%10;a=c%10;return this.getCellValue(b,a)},setCellValue:function(c,b,d){var a=this.getCell(c,b);a.setValue(d%10)},setNCellValue:function(d,c){var b,a;b=Math.floor(d/10)%10;a=d%10;this.setCellValue(b,a,c)}});Ext.define("BDC.lib.RegistersPanel",{extend:"Ext.panel.Panel",alias:"widget.registers-panel",title:"CPU Registers",columnWidth:0.2,layout:"vbox",bodyPadding:10,padding:"10px",ac0:0,ac1:0,pc0:0,pc1:0,ir0:0,ir1:0,ir2:0,items:[{xtype:"textfield",itemId:"ACC",fieldLabel:"A:",fieldCls:"memory-cell",labelWidth:20,minLength:1,maxLength:2,selectOnFocus:true,emptyText:"00",width:75,padding:"35 0 0 0"},{xtype:"textfield",itemId:"PC",fieldLabel:"PC:",fieldCls:"memory-cell",labelWidth:20,minLength:1,maxLength:2,selectOnFocus:true,emptyText:"00",width:75},{xtype:"textfield",itemId:"IR",fieldLabel:"IR:",fieldCls:"memory-cell",labelWidth:20,minLength:1,maxLength:3,selectOnFocus:true,emptyText:"000",width:75},{itemId:"haltText",html:"HALTED",baseCls:"halt-text"}],clear:function(){var a=this.getComponent("ACC");a.reset();a=this.getComponent("PC");a.reset();a=this.getComponent("IR");a.reset()},setAll:function(){this.setACC();this.setPC();this.setIR()},setACC:function(){var a=this.getComponent("ACC");var b=a.getValue();if(0<=b&&b<100){this.ac1=Math.floor(b/10);this.ac0=b%10}},setACCXY:function(a,c){var b=this.getComponent("ACC");this.ac1=a%10;this.ac0=c%10;b.setValue(""+this.ac1+""+this.ac0)},setACCN:function(c){var a,b;a=Math.floor(c/10)%10;b=c%10;this.setACCXY(a,b)},setPC:function(){var a=this.getComponent("PC");var b=a.getValue();if(0<=b&&b<100){this.pc1=Math.floor(b/10);this.pc0=b%10}},setPCXY:function(a,c){var b=this.getComponent("PC");this.pc1=a%10;this.pc0=c%10;b.setValue(""+this.pc1+""+this.pc0)},setPCN:function(c){var a,b;a=Math.floor(c/10)%10;b=c%10;this.setPCXY(a,b)},setIR:function(){var a=this.getComponent("IR");var b=a.getValue();if(0<=b&&b<1000){this.ir2=Math.floor(b/100);b=b%100;this.ir1=Math.floor(b/10);this.ir0=b%10}},clearHalt:function(){var a=this.getComponent("haltText");a.setVisible(false)},incPC:function(){var a=this.getComponent("PC");this.pc0++;if(this.pc0===10){this.pc0=0;this.pc1=(this.pc1+1)%10}a.setValue(""+this.pc1+""+this.pc0)},setIRXYZ:function(a,d,c){var b=this.getComponent("IR");this.ir2=a%10;this.ir1=d%10;this.ir0=c%10;b.setValue(""+this.ir2+""+this.ir1+""+this.ir0)},setIRN:function(d){var a,c,b;a=Math.floor(d/100)%10;d=d%100;c=Math.floor(d/10);b=d%10;this.setIRXYZ(a,c,b)},setStrings:function(){var a=this.getComponent("ACC");a.setValue(""+this.ac1+""+this.ac0);a=this.getComponent("PC");a.setValue(""+this.pc1+""+this.pc0);a=this.getComponent("IR");a.setValue(""+this.ir2+""+this.ir1+""+this.ir0)},setHalt:function(){var a=this.getComponent("haltText");a.setVisible(true)}});Ext.define("BDC.view.View",{extend:"Ext.panel.Panel",alias:"widget.bdc-view",requires:["BDC.lib.ButtonsPanel","BDC.lib.MemoryPanel","BDC.lib.RegistersPanel"],uses:["BDC.lib.Colors"],width:650,height:350,border:false,of:false,layout:{type:"column"},items:[{xtype:"buttons-panel"},{xtype:"memory-panel",itemId:"memoryPanel"},{xtype:"registers-panel",itemId:"registersPanel"}],reset:function(){var a=this.getComponent("memoryPanel");a.clear();a=this.getComponent("registersPanel");a.clear();a.clearHalt();this.of=false},highlightInstruction:function(c,b){var e,d;var a=this.getComponent("memoryPanel");d=Math.floor(c/10);e=c%10;a.highlight(d,e,b);c=(c+1)%100;d=Math.floor(c/10);e=c%10;a.highlight(d,e,b);c=(c+1)%100;d=Math.floor(c/10);e=c%10;a.highlight(d,e,b)},highlightData:function(e,b){var d,c;var a=this.getComponent("memoryPanel");c=Math.floor(e/10);d=e%10;a.highlight(c,d,b);e=(e+1)%100;c=Math.floor(e/10);d=e%10;a.highlight(c,d,b)},step:function(){var f,o;var b,e,d,a,m,l,r,q,p;var c,h,i,k,s,j;var g,n;f=this.getComponent("memoryPanel");f.resetGray();o=this.getComponent("registersPanel");o.setAll();o.clearHalt();e=o.ac0;d=o.ac1;b=e+10*d;m=o.pc0;l=o.pc1;r=f.getCellValue(l,m);o.incPC();m=o.pc0;l=o.pc1;q=f.getCellValue(l,m);o.incPC();m=o.pc0;l=o.pc1;p=f.getCellValue(l,m);o.incPC();m=o.pc0;l=o.pc1;o.setIRXYZ(p,q,r);o.setStrings();a=m+10*l;h=c=r+10*q;i=k=f.getNCellValue(c);s=j=f.getNCellValue((c+1)%100);g=n=k+10*j;if(p>=4){if(c===0){i=e;s=d;g=b}else{if(q===0){h=r+90;i=f.getNCellValue(h);s=f.getNCellValue((h+1)%100);h=i+10*s;i=f.getNCellValue(h);s=f.getNCellValue((h+1)%100);g=i+10*s}}}switch(p){case 0:if(r!==0||q!==0){o.setPCN(a+c)}else{o.setPCN(a+97);o.setHalt()}break;case 1:if(this.of){if(r!==0||q!==0){o.setPCN(a+c)}else{o.setPCN(a+97);o.setHalt()}}break;case 2:if(!this.of){if(r!==0||q!==0){o.setPCN(a+c)}else{o.setPCN(a+97);o.setHalt()}}break;case 3:o.setACCN(c);break;case 4:o.setACCN(g);break;case 5:this.of=b+n>100;o.setACCN((b+g)%100);break;case 6:this.of=b<n;o.setACCN((100+b-g)%100);break;case 7:if(c!==0){f.setNCellValue(h,e);f.setNCellValue((h+1)%100,d)}break;case 8:this.of=n===99;g=(g+1)%100;if(c!==0){s=Math.floor(g/10);i=g%10;f.setNCellValue(h,i);f.setNCellValue((h+1)%100,s)}else{o.setACCN(g)}break;case 9:this.of=n===0;g=(g+99)%100;if(c!==0){s=Math.floor(g/10);i=g%10;f.setNCellValue(h,i);f.setNCellValue((h+1)%100,s)}else{o.setACCN(g)}break}if(p>=4){if(q!==0){this.highlightData(c,BDC.lib.Colors.BLUE)}else{if(r!==0){this.highlightData(90+c,BDC.lib.Colors.GREEN);this.highlightData(h,BDC.lib.Colors.BLUE)}}}m=o.pc0;l=o.pc1;a=m+10*l;this.highlightInstruction(a,BDC.lib.Colors.MAGENTA)},loadProgram:function(d){var k,h,c,b,a=0,g,f,e;k=this.getComponent("memoryPanel");h=this.getComponent("registersPanel");this.reset();h.setACCN(d[a++]);h.setPCN(d[a++]);h.setIRN(d[a++]);for(c=0;c<10;c++){for(b=0;b<10;b++){k.setCellValue(c,b,d[a++])}}h.setAll();g=h.pc0;f=h.pc1;e=g+10*f;this.highlightInstruction(e,BDC.lib.Colors.MAGENTA)}});Ext.define("BDC.controller.Controller",{extend:"Ext.app.Controller",uses:["BDC.lib.Programs"],views:["BDC.view.View"],refs:[{selector:"bdc-view",ref:"BDCView"}],init:function(){this.control({"bdc-view":{afterrender:this.onViewAfterRender},"#resetButton":{click:this.onReset},"#stepButton":{click:this.onStep},"#programOne":{click:this.onProgramOne},"#programTwo":{click:this.onProgramTwo},"#programThree":{click:this.onProgramThree},"#programFour":{click:this.onProgramFour},"#programFive":{click:this.onProgramFive},"#programSix":{click:this.onProgramSix}})},onViewAfterRender:function(a){a.reset()},onReset:function(){var a=this.getBDCView();a.reset()},onStep:function(){var a=this.getBDCView();a.step()},onProgramOne:function(){var a=this.getBDCView();a.loadProgram(BDC.lib.Programs.PROGRAM_ONE)},onProgramTwo:function(){var a=this.getBDCView();a.loadProgram(BDC.lib.Programs.PROGRAM_TWO)},onProgramThree:function(){var a=this.getBDCView();a.loadProgram(BDC.lib.Programs.PROGRAM_THREE)},onProgramFour:function(){var a=this.getBDCView();a.loadProgram(BDC.lib.Programs.PROGRAM_FOUR)},onProgramFive:function(){var a=this.getBDCView();a.loadProgram(BDC.lib.Programs.PROGRAM_FIVE)},onProgramSix:function(){var a=this.getBDCView();a.loadProgram(BDC.lib.Programs.PROGRAM_SIX)}});Ext.define("BDC.lib.Colors",{statics:{BLUE:"0000FF",GREEN:"00FF00",MAGENTA:"FF00FF"}});Ext.define("BDC.lib.Programs",{statics:{PROGRAM_ONE:[0,0,0,0,0,3,8,9,7,4,9,9,9,0,1,8,9,4,6,9,5,2,8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,7,0,5,0,0,0],PROGRAM_TWO:[0,0,0,0,0,3,8,9,7,4,9,4,6,9,6,6,0,1,8,9,8,8,8,0,8,9,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,9,2,3,0,0,0],PROGRAM_THREE:[0,0,0,0,0,3,8,9,7,8,9,4,4,9,5,8,9,7,4,9,8,6,9,4,4,9,6,9,7,2,8,9,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,7,0,2,1,0,0],PROGRAM_FOUR:[0,0,0,1,0,3,4,9,7,6,9,7,4,9,4,6,9,5,8,9,7,6,9,4,4,9,7,8,9,4,6,9,7,6,7,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,0,3,0,0,0],PROGRAM_FIVE:[0,0,0,9,9,3,8,9,7,1,0,3,6,9,7,4,9,4,6,9,6,5,1,1,8,9,8,6,9,4,6,9,5,6,9,7,6,7,0,8,9,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,5,0,0,0,0],PROGRAM_SIX:[0,0,0,0,0,3,8,9,9,5,1,1,6,0,5,6,9,8,6,9,8,8,9,9,5,8,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,1,1,5,0,2,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,4,0]}});Ext.define("BDC.lib.Frame",{extend:"Ext.window.Window",alias:"bdc-frame",closable:false,title:"Basic Decimal Computer",items:[{xtype:"bdc-view"}],resizable:false,initComponent:function(){Ext.QuickTips.init();Ext.tip.Tip.prototype.minWidth=200;this.callParent(arguments)}});Ext.application({name:"BDC",appFolder:"app",controllers:["Controller"],uses:"BDC.lib.Frame",launch:function(){Ext.create("bdc-frame").show()}});
