/**
 * Created by 
 * User: Sameer Shemna 
 * Website: www.sameershemna.com
 * Email: sameersemna@gmail.com
 * Date: 16/9/14
 * Time: 6:39 PM
 * Ref for similar PHP Class: https://github.com/stormpat/Container-validator
 */

function ContainerValidator()  {

    /**
     * @functions list
     *
     * isValid()
     * validate()
     * getErrorMessages()
     * getOwnerCode()
     * getProductGroupCode()
     * getRegistrationDigit()
     * getCheckDigit()
     * generate()
     * createCheckDigit()
     * clearErrors()
     * buildCheckDigit()
     * identify()
     *
     **/
    
    //SHS Constants addition
    var STR_PAD_LEFT = 'STR_PAD_LEFT';

    this.alphabetNumerical = {
        'A' : 10, 'B' : 12, 'C' : 13, 'D' : 14, 'E' : 15, 'F' : 16, 'G' : 17, 'H' : 18, 'I' : 19,
        'J' : 20, 'K' : 21, 'L' : 23, 'M' : 24, 'N' : 25, 'O' : 26, 'P' : 27, 'Q' : 28, 'R' : 29,
        'S' : 30, 'T' : 31, 'U' : 32, 'V' : 34, 'W' : 35, 'X' : 36, 'Y' : 37, 'Z' : 38
    };
    this.pattern = /^([A-Z]{3})(U|J|Z)(\d{6})(\d)$/;
    this.patternWithoutCheckDigit = /^([A-Z]{3})(U|J|Z)(\d{6})$/;
    this.errorMessages = [];
    this.ownerCode = [];
    this.productGroupCode;
    this.registrationDigit = [];
    this.checkDigit;
    this.containerNumber;

    /**
     * Check if the container has a valid container code
     *
     * @return boolean
     */
     this.isValid = function(containerNumber)
    {
        valid = this.validate(containerNumber);
        if (this.empty(this.errorMessages)) {
            return true;
        }
        return false;
    }

     this.validate = function(containerNumber)
    {
        matches = [];

        if (!this.empty(containerNumber) && this.is_string(containerNumber)) {
            matches = this.identify(containerNumber);

            if (this.count(matches) !== 5) {
                this.errorMessages.push('The container number is invalid');
            } else {
                checkDigit = this.buildCheckDigit(matches);

                if (this.checkDigit != checkDigit) {
                    this.errorMessages.push('The check digit does not match');
                    matches = [];
                }
            }
        } else {
            this.errorMessages = {0:'The container number must be a string'};
        }
        return matches;
    }

     this.getErrorMessages = function()
    {
        return this.errorMessages;
    }

     this.getOwnerCode = function()
    {
        if (this.empty(this.ownerCode)) {
            this.errorMessages.push('You must call validate or isValid first');
        }
        return this.ownerCode;
    }

     this.getProductGroupCode = function()
    {
        if (this.empty(this.productGroupCode)) {
            this.errorMessages.push('You must call validate or isValid first');
        }
        return this.productGroupCode;
    }

     this.getRegistrationDigit = function()
    {
        if (this.empty(this.registrationDigit)) {
            this.errorMessages.push('You must call validate or isValid first');
        }
        return this.registrationDigit;
    }

     this.getCheckDigit = function()
    {
        if (this.empty(this.checkDigit)) {
            this.errorMessages.push('You must call validate or isValid first');
        }
        return this.checkDigit;
    }

     this.generate = function(ownerCode, productGroupCode, from, to)
    {
        //SHS set default values for params
        from = typeof from !== 'undefined' ? from : 0;
        to = typeof to !== 'undefined' ? to : 999999;

        alphabetCode = this.strtoupper(ownerCode + productGroupCode);
        containers_no = [];

        if (this.is_string(alphabetCode) && this.strlen(ownerCode) === 3 && this.strlen(productGroupCode) === 1) {
            containers_no = [];
            current_container_no = '';
            current_container_check_digit = '';

            if ((from >= 0) && (to < 1000000) && ((to - from) > 0)) {
                for(var i = from; i <= to; i++) {
                    current_container_no = alphabetCode + this.str_pad(i, 6, '0', STR_PAD_LEFT);
                    current_container_check_digit = this.createCheckDigit(current_container_no);

                    if (current_container_check_digit < 0) {
                        this.errorMessages.push('Error generating container number at number ' + i);
                        return containers_no;
                    }

                    containers_no[i] = current_container_no + current_container_check_digit;
                }
            } else {
                this.errorMessages.push('Invalid number to generate, minimal is 0 and maximal is 999999');
            }

        } else {
            this.errorMessages.push('Invalid owner code or product group code');
        }

        return containers_no;
    }

     this.createCheckDigit = function(containerNumber)
    {
        checkDigit = -1;
        if (!this.empty(containerNumber) && this.is_string(containerNumber)) {
            matches = this.identify( containerNumber, true );

            if (this.count(matches) !== 4 || (matches[4])) {
                this.errorMessages.push('Invalid container number');
            } else {
                checkDigit = this.buildCheckDigit(matches);
                if (checkDigit < 0) {
                    this.errorMessages.push('Invalid container number');
                }
            }
        } else {
            this.errorMessages.push('Container number must be a string');
        }
        return checkDigit;
    }

     this.clearErrors = function()
    {
        this.errorMessages = [];
    }

     this.buildCheckDigit = function(matches)
    {

        if ((matches[1])) {
            this.ownerCode = this.str_split(matches[1]);
        }
        if ((matches[2])) {
            this.productGroupCode = matches[2];
        }
        if ((matches[3])) {
            this.registrationDigit = this.str_split(matches[3]);
        }
        if ((matches[4])) {
            this.checkDigit = matches[4];
        }

        // convert owner code + product group code to its numerical value
        numericalOwnerCode = [];
        for(var i = 0; i < this.count(this.ownerCode); i++) {
            numericalOwnerCode[i] = this.alphabetNumerical[this.ownerCode[i]];
        }
        numericalOwnerCode.push(this.alphabetNumerical[this.productGroupCode]);

        // merge numerical owner code with registration digit
        numericalCode = this.array_merge(numericalOwnerCode, this.registrationDigit);
        sumDigit = 0;

        // check six-digit registration number and last check digit
        for(var i = 0; i < this.count(numericalCode); i++) {
            sumDigit += numericalCode[i] * Math.pow(2, i);
        }

        sumDigitDiff = Math.floor(sumDigit / 11) * 11;
        checkDigit = sumDigit - sumDigitDiff;
        return (checkDigit == 10) ? 0 : checkDigit;
    }

     this.identify = function(containerNumber, withoutCheckDigit)
    {
        //SHS set default values for params
        withoutCheckDigit = typeof withoutCheckDigit !== 'undefined' ? withoutCheckDigit : false;
        
        this.clearErrors();

        if (withoutCheckDigit) {
            matches = this.preg_match(this.patternWithoutCheckDigit, this.strtoupper(containerNumber));
        } else {
            matches = this.preg_match(this.pattern, this.strtoupper(containerNumber));
        }
        return matches;
    }
    
    //SHS Helper functions
    this.is_string = function(param){
        return typeof param == 'string' ? true : false;
    }
    
    this.preg_match = function(pattern, string){
        var regex = new RegExp(pattern);
        return regex.exec(string);
    }
    
    this.strtoupper = function(string){
        return string.toUpperCase();
    }
    
    this.count = function(array){
        if (array == null) {
            return 0;
        }else{
            return array.length;
        }
    }
    
    this.strlen = function(string){
        return string.length;
    }
    
    // PHPJS Helper functions    Ref: http://phpjs.org          Remove if using PHPJS 
    this.str_split = function(string, split_length) {
        //  discuss at: http://phpjs.org/functions/str_split/
        // original by: Martijn Wieringa
        // improved by: Brett Zamir (http://brett-zamir.me)
        // bugfixed by: Onno Marsman
        //  revised by: Theriault
        //  revised by: Rafal Kukawski (http://blog.kukawski.pl/)
        //    input by: Bjorn Roesbeke (http://www.bjornroesbeke.be/)
        //   example 1: str_split('Hello Friend', 3);
        //   returns 1: ['Hel', 'lo ', 'Fri', 'end']
      
        if (split_length == null) {
          split_length = 1;
        }
        if (string == null || split_length < 1) {
          return false;
        }
        string += '';
        var chunks = [],
          pos = 0,
          len = string.length;
        while (pos < len) {
          chunks.push(string.slice(pos, pos += split_length));
        }
        
        return chunks;
    }
    
    this.str_pad = function(input, pad_length, pad_string, pad_type) {
        //  discuss at: http://phpjs.org/functions/str_pad/
        // original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // improved by: Michael White (http://getsprink.com)
        //    input by: Marco van Oort
        // bugfixed by: Brett Zamir (http://brett-zamir.me)
        //   example 1: str_pad('Kevin van Zonneveld', 30, '-=', 'STR_PAD_LEFT');
        //   returns 1: '-=-=-=-=-=-Kevin van Zonneveld'
        //   example 2: str_pad('Kevin van Zonneveld', 30, '-', 'STR_PAD_BOTH');
        //   returns 2: '------Kevin van Zonneveld-----'
      
        var half = '',
          pad_to_go;
      
        var str_pad_repeater = function(s, len) {
          var collect = '',
            i;
      
          while (collect.length < len) {
            collect += s;
          }
          collect = collect.substr(0, len);
      
          return collect;
        };
      
        input += '';
        pad_string = pad_string !== undefined ? pad_string : ' ';
      
        if (pad_type !== 'STR_PAD_LEFT' && pad_type !== 'STR_PAD_RIGHT' && pad_type !== 'STR_PAD_BOTH') {
          pad_type = 'STR_PAD_RIGHT';
        }
        if ((pad_to_go = pad_length - input.length) > 0) {
          if (pad_type === 'STR_PAD_LEFT') {
            input = str_pad_repeater(pad_string, pad_to_go) + input;
          } else if (pad_type === 'STR_PAD_RIGHT') {
            input = input + str_pad_repeater(pad_string, pad_to_go);
          } else if (pad_type === 'STR_PAD_BOTH') {
            half = str_pad_repeater(pad_string, Math.ceil(pad_to_go / 2));
            input = half + input + half;
            input = input.substr(0, pad_length);
          }
        }
        
        return input;
    }
    
    this.array_merge = function() {
        //  discuss at: http://phpjs.org/functions/array_merge/
        // original by: Brett Zamir (http://brett-zamir.me)
        // bugfixed by: Nate
        // bugfixed by: Brett Zamir (http://brett-zamir.me)
        //    input by: josh
        //   example 1: arr1 = {"color": "red", 0: 2, 1: 4}
        //   example 1: arr2 = {0: "a", 1: "b", "color": "green", "shape": "trapezoid", 2: 4}
        //   example 1: array_merge(arr1, arr2)
        //   returns 1: {"color": "green", 0: 2, 1: 4, 2: "a", 3: "b", "shape": "trapezoid", 4: 4}
        //   example 2: arr1 = []
        //   example 2: arr2 = {1: "data"}
        //   example 2: array_merge(arr1, arr2)
        //   returns 2: {0: "data"}
      
        var args = Array.prototype.slice.call(arguments),
          argl = args.length,
          arg,
          retObj = {},
          k = '',
          argil = 0,
          j = 0,
          i = 0,
          ct = 0,
          toStr = Object.prototype.toString,
          retArr = true;
      
        for (i = 0; i < argl; i++) {
          if (toStr.call(args[i]) !== '[object Array]') {
            retArr = false;
            break;
          }
        }
      
        if (retArr) {
          retArr = [];
          for (i = 0; i < argl; i++) {
            retArr = retArr.concat(args[i]);
          }
          return retArr;
        }
      
        for (i = 0, ct = 0; i < argl; i++) {
          arg = args[i];
          if (toStr.call(arg) === '[object Array]') {
            for (j = 0, argil = arg.length; j < argil; j++) {
              retObj[ct++] = arg[j];
            }
          } else {
            for (k in arg) {
              if (arg.hasOwnProperty(k)) {
                if (parseInt(k, 10) + '' === k) {
                  retObj[ct++] = arg[k];
                } else {
                  retObj[k] = arg[k];
                }
              }
            }
          }
        }
        return retObj;
    }
    
    this.empty = function(mixed_var) {
        //  discuss at: http://phpjs.org/functions/empty/
        // original by: Philippe Baumann
        //    input by: Onno Marsman
        //    input by: LH
        //    input by: Stoyan Kyosev (http://www.svest.org/)
        // bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // improved by: Onno Marsman
        // improved by: Francesco
        // improved by: Marc Jansen
        // improved by: Rafal Kukawski
        //   example 1: empty(null);
        //   returns 1: true
        //   example 2: empty(undefined);
        //   returns 2: true
        //   example 3: empty([]);
        //   returns 3: true
        //   example 4: empty({});
        //   returns 4: true
        //   example 5: empty({'aFunc' : function () { alert('humpty'); } });
        //   returns 5: false
      
        var undef, key, i, len;
        var emptyValues = [undef, null, false, 0, '', '0'];
      
        for (i = 0, len = emptyValues.length; i < len; i++) {
          if (mixed_var === emptyValues[i]) {
            return true;
          }
        }
      
        if (typeof mixed_var === 'object') {
          for (key in mixed_var) {
            //if (mixed_var.hasOwnProperty(key)) {
            return false;
            //}
          }
          return true;
        }
      
        return false;
    }
}
