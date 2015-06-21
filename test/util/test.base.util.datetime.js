'use strict';
if (typeof exports === 'object' && typeof module === 'object') {
  var Should = require('should');
  var mmeddle = require('../mmeddle');
}

(function (mm) {
  var _  = mm.check(mm._);

  describe('util date and time functions', function(){
    var x;
    describe('#yyyymmdd', function(){
      it('should format dates properly', function() {
        x = mm.util.yyyymmdd() ;
        x.should.have.length(8);
        x.should.startWith('20');
        x = mm.util.yyyymmdd(new Date('12/22/2015'));
        x.should.eql('20151222');
        
        x = mm.util.yyyymmdd('12/5/2015');
        x.should.eql('20151205');
        
        var d = 1434782949145; // _.now() values.
        x = mm.util.yyyymmdd(d);
        x.should.eql('20150620');
        
        x = mm.util.yyyymmdd(_.now());
        x.should.have.length(8);
        x.should.startWith('20');
      })
    })
    
    describe('#yymmdd', function(){
      it('should format dates properly', function() {
        x = mm.util.yymmdd();
        x.should.have.length(6);
        x = mm.util.yymmdd(new Date('12/22/2015'));
        x.should.eql('151222');
        
        x = mm.util.yymmdd('12/5/2015');
        x.should.eql('151205');
        
        var d = 1434782949145; // _.now() values.
        x = mm.util.yymmdd(d);
        x.should.eql('150620');
        
        x = mm.util.yymmdd(_.now());
        x.should.have.length(6);
      })
    })
    
    describe('#timestamp', function(){
      it('should format timestamps properly', function() {
        x = mm.util.timestamp();
        x.should.have.length(15);
        x = mm.util.timestamp(new Date('12/22/2015 12:34:56'));
        //mm.log('1----- ', x);
        x.should.eql('151222|12:34:56');
        
        x = mm.util.timestamp('12/5/2015 01:02');
        x.should.eql('151205|01:02:00');
        
        var d = 1434782949145; // _.now() values.
        x = mm.util.timestamp(d);
        x.should.eql('150620|00:49:09');
        
        x = mm.util.timestamp(_.now());
        x.should.have.length(15);
      })
    })

    describe('#monthName', function(){
      it('should obtain the proper month name', function() {
        x = mm.util.monthName(new Date('12/22/2015 12:34:56'));
        x.should.eql('December');
        x = mm.util.monthName('11/5/2015 01:02');
        x.should.eql('November');
        var d = 1434782949145; // _.now() values.
        x = mm.util.monthName(d);
        Should.exist(x);
        x.should.eql('June');
        var spanishMonths = 
            ['enero',      'febrero', 'marzo',     'abril',
             'mayo',       'junio',   'julio',     'agusto', 
             'septiembre', 'octubre', 'noviembre', 'deciembre'];
        x = mm.util.monthName(d, spanishMonths);
        x.should.eql('junio');
      })
    })

    describe('#monthName and #monthName3', function(){
      it('should obtain the proper month name', function() {
        x = mm.util.monthName(new Date('12/22/2015 12:34:56'));
        x.should.eql('December');
        x = mm.util.monthName('11/5/2015 01:02');
        x.should.eql('November');
        var d = 1434782949145; // _.now() values.
        x = mm.util.monthName(d);
        x.should.eql('June');
        var spanishMonths = 
            ['enero',      'febrero', 'marzo',     'abril',
             'mayo',       'junio',   'julio',     'agusto', 
             'septiembre', 'octubre', 'noviembre', 'deciembre'];
        x = mm.util.monthName(d, spanishMonths);
        x.should.eql('junio');
      })

      it('should obtain the proper 3 letter month', function() {
        var d = 1434782949145; // _.now() values.
        x = mm.util.monthName3(d);
        x.should.eql('Jun');
        var spanishMonths3 = 
            ['ene', 'feb', 'mar', 'abr', 'may', 'jun',
             'jul', 'agu', 'sep', 'oct', 'nov', 'dec'];
        x = mm.util.monthName3(d, spanishMonths3);
        x.should.eql('jun');
        x = mm.util.monthName('01/5/2015 01:02', spanishMonths3);
        x.should.eql('ene');
      })
    })
    
    describe('#weekday and #weekday3', function(){
      it('should obtain the proper weekday name', function() {
        x = mm.util.weekday(new Date('12/22/2015 12:34:56'));
        x.should.eql('Tuesday');
        x = mm.util.weekday('11/5/2015 01:02', 6);
        x.should.eql('Friday');
        var d = 1434782949145; // _.now() values.
        x = mm.util.weekday(d);
        x.should.eql('Saturday');
        var spanishDayNames = ['domingo', 'lunes', 'martes', 
            'miercoles', 'jueves', 'viernes', 'sabado'];
        x = mm.util.weekday(d, 1, spanishDayNames);
        x.should.eql('lunes');
        Should.exist(x);
      })

      it('should obtain the proper 3 letter day name', function() {
        var d = 1434782949145; // _.now() values.
        x = mm.util.weekday3(d);
        x.should.eql('Sat');
        x = mm.util.weekday3(d, 5);
        x.should.eql('Fri');
        x = mm.util.weekday3('01/5/2015 01:02', 1);
        x.should.eql('Thu');
        Should.exist(x);        
      })
    })
    
    
    
  })
}(mmeddle));  
