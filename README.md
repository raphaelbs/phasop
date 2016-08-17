# phasop

Command-line tools for complex numbers (phasor) operations.

This CLI-Tool enables fast polar and rectangular operations.
By definition polar points are defined like _(modulus, radius)_ and rectangular points are defined like _(x, y**i**)_ where **i** letter is mandatory; and in this README any _(modulus, radius)_ or _(x, y**i**)_ are know as **matrix**.


## Installation
```shell
> npm install -g phasop
```
Make sure to include the **-g** option

---

## Usage

Converting Polar phasor to Retangular phasor:
```shell
> phasop (5,53.13)
```
```shell
> polar form(5, 53.13 degrees)
> rectangular form(3, 4i)
```

#### radian
You can output any of the following [operations](https://www.npmjs.com/package/phasop#operations) in radians instead of the default degrees.
```shell
> phasop -r add (4,3i) (3,-4i)
```
```shell
> (4, 3i) + (3, -4i)
> polar form(7.07, -0.14 radian)
> rectangular form(7, -1i)
```

___

#### endless
You can also input several matrix for a single operation
```shell
> phasop -r add (4,3i) (3,-4i) (-5, 36.87)
```
```shell
> (4, 3i) + (3, -4i) + (-5, 36.87d)
> polar form(5, -53.13 degrees)
> rectangular form(3, -4i)
```

---

### Operations

#### add
```shell
> phasop add (4,3i) (3,-4i)
```
```shell
> (4, 3i) + (3, -4i)
> polar form(7.07, -8.13 degrees)
> rectangular form(7, -1i)
```

___

#### sub
```shell
> phasop sub (4,3i) (3,-4i)
```
```shell
> (4, 3i) - (3, -4i)
> polar form(7.07, 81.87 degrees)
> rectangular form(1, 7i)
```

___

#### mult
```shell
> phasop mult (4,3i) (3,-4i)
```
```shell
> (4, 3i) * (3, -4i)
> polar form(25, -16.26 degrees)
> rectangular form(24, -7i)
```

___

#### div
```shell
> phasop div (4,3i) (3,-4i)
```
```shell
> (4, 3i) / (3, -4i)
> polar form(1, 90 degrees)
> rectangular form(0, 1i)
```

---

## Dependencies

commander

---

## License

MIT
