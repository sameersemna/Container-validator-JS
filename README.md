Container-validator-JS
======================

Cargo container validator ISO 6346 implemented in Javascript

Demo
====

[sameershemna.com](http://sameershemna.com/container_validator/)


Install
=======

```html
<script type="text/javascript" src="ContainerValidator.js"></script>
```



Documentation
=============

Validate container ISO codes (TEXU3070079 = valid, TEXU3070070 != valid)

```javascript
validator = new ContainerValidator();
validator.isValid('TEXU3070079'); // boolean true
validator.isValid('TEXU3070070'); // boolean false
```

To get the diffrent segments from the code you can do,

```javascript
container = validator.validate('TEXU3070079');
console.log(container); // Array ( [0] => TEXU3070079 [1] => TEX [2] => U [3] => 307007 [4] => 9 )
```
where:

```javascript
array
  0 => string 'TEXU3070079' // The code being validated
  1 => string 'TEX' // The containers ownercode
  2 => string 'U' // The containers group code
  3 => string '307007' // The containers registration digit
  4 => string '9' // The containers check digit
```

How to get error messages when the container code is invalid

```javascript
validator.validate('TEXU3070070');
validator.getErrorMessages(); // The check digit does not match

validator.validate(12345678910);
validator.getErrorMessages(); // The container number must be a string

validator.validate('C3P0');
validator.getErrorMessages(); // The container number is invalid
```

Access information about the container:
```javascript
validator.validate('TEXU3070070');
console.log(validator.getOwnerCode()); // TEX
console.log(validator.getProductGroupCode()); // U
console.log(validator.getRegistrationDigit()); // 307007
console.log(validator.getCheckDigit()); // 9
```

Create a check digit to a container that does not have one
```javascript
validator = new ContainerValidator();
validator.createCheckDigit('TEXU307007'); // 9
```

Generate container numbers:
```javascript
// validator.generate( owner-code, product-group-code, number-start, number-end );
validator = new ContainerValidator();
validator.generate('TEX','U',1, 100 ));
```






Credits
=======
            

Wonderpoint Software Pvt Ltd [wonderpoint.com](http://www.wonderpoint.com)

Wikipedia : ISO 6346 [wikipedia.org](http://en.wikipedia.org/wiki/ISO_6346)

PHP Script : Patrik Stormpat [github.com](https://github.com/stormpat/Container-validator)

PHP JS [phpjs.org](http://phpjs.org)

Icons [fancyicons.com](http://www.fancyicons.com/free-icon/108/gis-gps-icon-set/free-container-red-icon-png/)

Salute to the original author,
[gedex.adc](http://www.google.com/gedex.web.id)



License
=======

The MIT License (MIT)

Copyright (c) 2014 sameersemna

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
