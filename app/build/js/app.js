
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: mark@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define('famous/core/Entity',['require','exports','module'],function(require, exports, module) {
    /**
     * A singleton that maintains a global registry of Surfaces.
     *   Private.
     *
     * @private
     * @static
     * @class Entity
     */

    var entities = [];

    /**
     * Get entity from global index.
     *
     * @private
     * @method get
     * @param {Number} id entity registration id
     * @return {Surface} entity in the global index
     */
    function get(id) {
        return entities[id];
    }

    /**
     * Overwrite entity in the global index
     *
     * @private
     * @method set
     * @param {Number} id entity registration id
     * @param {Surface} entity to add to the global index
     */
    function set(id, entity) {
        entities[id] = entity;
    }

    /**
     * Add entity to global index
     *
     * @private
     * @method register
     * @param {Surface} entity to add to global index
     * @return {Number} new id
     */
    function register(entity) {
        var id = entities.length;
        set(id, entity);
        return id;
    }

    /**
     * Remove entity from global index
     *
     * @private
     * @method unregister
     * @param {Number} id entity registration id
     */
    function unregister(id) {
        set(id, null);
    }

    module.exports = {
        register: register,
        unregister: unregister,
        get: get,
        set: set
    };
});

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: mark@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define('famous/core/Transform',['require','exports','module'],function(require, exports, module) {

    /**
     *  A high-performance static matrix math library used to calculate
     *    affine transforms on surfaces and other renderables.
     *    Famo.us uses 4x4 matrices corresponding directly to
     *    WebKit matrices (column-major order).
     *
     *    The internal "type" of a Matrix is a 16-long float array in
     *    row-major order, with:
     *    elements [0],[1],[2],[4],[5],[6],[8],[9],[10] forming the 3x3
     *          transformation matrix;
     *    elements [12], [13], [14] corresponding to the t_x, t_y, t_z
     *           translation;
     *    elements [3], [7], [11] set to 0;
     *    element [15] set to 1.
     *    All methods are static.
     *
     * @static
     *
     * @class Transform
     */
    var Transform = {};

    // WARNING: these matrices correspond to WebKit matrices, which are
    //    transposed from their math counterparts
    Transform.precision = 1e-6;
    Transform.identity = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];

    /**
     * Multiply two or more Transform matrix types to return a Transform matrix.
     *
     * @method multiply4x4
     * @static
     * @param {Transform} a left Transform
     * @param {Transform} b right Transform
     * @return {Transform}
     */
    Transform.multiply4x4 = function multiply4x4(a, b) {
        return [
            a[0] * b[0] + a[4] * b[1] + a[8] * b[2] + a[12] * b[3],
            a[1] * b[0] + a[5] * b[1] + a[9] * b[2] + a[13] * b[3],
            a[2] * b[0] + a[6] * b[1] + a[10] * b[2] + a[14] * b[3],
            a[3] * b[0] + a[7] * b[1] + a[11] * b[2] + a[15] * b[3],
            a[0] * b[4] + a[4] * b[5] + a[8] * b[6] + a[12] * b[7],
            a[1] * b[4] + a[5] * b[5] + a[9] * b[6] + a[13] * b[7],
            a[2] * b[4] + a[6] * b[5] + a[10] * b[6] + a[14] * b[7],
            a[3] * b[4] + a[7] * b[5] + a[11] * b[6] + a[15] * b[7],
            a[0] * b[8] + a[4] * b[9] + a[8] * b[10] + a[12] * b[11],
            a[1] * b[8] + a[5] * b[9] + a[9] * b[10] + a[13] * b[11],
            a[2] * b[8] + a[6] * b[9] + a[10] * b[10] + a[14] * b[11],
            a[3] * b[8] + a[7] * b[9] + a[11] * b[10] + a[15] * b[11],
            a[0] * b[12] + a[4] * b[13] + a[8] * b[14] + a[12] * b[15],
            a[1] * b[12] + a[5] * b[13] + a[9] * b[14] + a[13] * b[15],
            a[2] * b[12] + a[6] * b[13] + a[10] * b[14] + a[14] * b[15],
            a[3] * b[12] + a[7] * b[13] + a[11] * b[14] + a[15] * b[15]
        ];
    };

    /**
     * Fast-multiply two or more Transform matrix types to return a
     *    Matrix, assuming bottom row on each is [0 0 0 1].
     *
     * @method multiply
     * @static
     * @param {Transform} a left Transform
     * @param {Transform} b right Transform
     * @return {Transform}
     */
    Transform.multiply = function multiply(a, b) {
        return [
            a[0] * b[0] + a[4] * b[1] + a[8] * b[2],
            a[1] * b[0] + a[5] * b[1] + a[9] * b[2],
            a[2] * b[0] + a[6] * b[1] + a[10] * b[2],
            0,
            a[0] * b[4] + a[4] * b[5] + a[8] * b[6],
            a[1] * b[4] + a[5] * b[5] + a[9] * b[6],
            a[2] * b[4] + a[6] * b[5] + a[10] * b[6],
            0,
            a[0] * b[8] + a[4] * b[9] + a[8] * b[10],
            a[1] * b[8] + a[5] * b[9] + a[9] * b[10],
            a[2] * b[8] + a[6] * b[9] + a[10] * b[10],
            0,
            a[0] * b[12] + a[4] * b[13] + a[8] * b[14] + a[12],
            a[1] * b[12] + a[5] * b[13] + a[9] * b[14] + a[13],
            a[2] * b[12] + a[6] * b[13] + a[10] * b[14] + a[14],
            1
        ];
    };

    /**
     * Return a Transform translated by additional amounts in each
     *    dimension. This is equivalent to the result of
     *
     *    Transform.multiply(Matrix.translate(t[0], t[1], t[2]), m).
     *
     * @method thenMove
     * @static
     * @param {Transform} m a Transform
     * @param {Array.Number} t floats delta vector of length 2 or 3
     * @return {Transform}
     */
    Transform.thenMove = function thenMove(m, t) {
        if (!t[2]) t[2] = 0;
        return [m[0], m[1], m[2], 0, m[4], m[5], m[6], 0, m[8], m[9], m[10], 0, m[12] + t[0], m[13] + t[1], m[14] + t[2], 1];
    };

    /**
     * Return a Transform matrix which represents the result of a transform matrix
     *    applied after a move. This is faster than the equivalent multiply.
     *    This is equivalent to the result of:
     *
     *    Transform.multiply(m, Transform.translate(t[0], t[1], t[2])).
     *
     * @method moveThen
     * @static
     * @param {Array.Number} v vector representing initial movement
     * @param {Transform} m matrix to apply afterwards
     * @return {Transform} the resulting matrix
     */
    Transform.moveThen = function moveThen(v, m) {
        if (!v[2]) v[2] = 0;
        var t0 = v[0] * m[0] + v[1] * m[4] + v[2] * m[8];
        var t1 = v[0] * m[1] + v[1] * m[5] + v[2] * m[9];
        var t2 = v[0] * m[2] + v[1] * m[6] + v[2] * m[10];
        return Transform.thenMove(m, [t0, t1, t2]);
    };

    /**
     * Return a Transform which represents a translation by specified
     *    amounts in each dimension.
     *
     * @method translate
     * @static
     * @param {Number} x x translation
     * @param {Number} y y translation
     * @param {Number} z z translation
     * @return {Transform}
     */
    Transform.translate = function translate(x, y, z) {
        if (z === undefined) z = 0;
        return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, x, y, z, 1];
    };

    /**
     * Return a Transform scaled by a vector in each
     *    dimension. This is a more performant equivalent to the result of
     *
     *    Transform.multiply(Transform.scale(s[0], s[1], s[2]), m).
     *
     * @method thenScale
     * @static
     * @param {Transform} m a matrix
     * @param {Array.Number} s delta vector (array of floats &&
     *    array.length == 3)
     * @return {Transform}
     */
    Transform.thenScale = function thenScale(m, s) {
        return [
            s[0] * m[0], s[1] * m[1], s[2] * m[2], 0,
            s[0] * m[4], s[1] * m[5], s[2] * m[6], 0,
            s[0] * m[8], s[1] * m[9], s[2] * m[10], 0,
            s[0] * m[12], s[1] * m[13], s[2] * m[14], 1
        ];
    };

    /**
     * Return a Transform which represents a scale by specified amounts
     *    in each dimension.
     *
     * @method scale
     * @static
     * @param {Number} x x scale factor
     * @param {Number} y y scale factor
     * @param {Number} z z scale factor
     * @return {Transform}
     */
    Transform.scale = function scale(x, y, z) {
        if (z === undefined) z = 1;
        if (y === undefined) y = x;
        return [x, 0, 0, 0, 0, y, 0, 0, 0, 0, z, 0, 0, 0, 0, 1];
    };

    /**
     * Return a Transform which represents a clockwise
     *    rotation around the x axis.
     *
     * @method rotateX
     * @static
     * @param {Number} theta radians
     * @return {Transform}
     */
    Transform.rotateX = function rotateX(theta) {
        var cosTheta = Math.cos(theta);
        var sinTheta = Math.sin(theta);
        return [1, 0, 0, 0, 0, cosTheta, sinTheta, 0, 0, -sinTheta, cosTheta, 0, 0, 0, 0, 1];
    };

    /**
     * Return a Transform which represents a clockwise
     *    rotation around the y axis.
     *
     * @method rotateY
     * @static
     * @param {Number} theta radians
     * @return {Transform}
     */
    Transform.rotateY = function rotateY(theta) {
        var cosTheta = Math.cos(theta);
        var sinTheta = Math.sin(theta);
        return [cosTheta, 0, -sinTheta, 0, 0, 1, 0, 0, sinTheta, 0, cosTheta, 0, 0, 0, 0, 1];
    };

    /**
     * Return a Transform which represents a clockwise
     *    rotation around the z axis.
     *
     * @method rotateZ
     * @static
     * @param {Number} theta radians
     * @return {Transform}
     */
    Transform.rotateZ = function rotateZ(theta) {
        var cosTheta = Math.cos(theta);
        var sinTheta = Math.sin(theta);
        return [cosTheta, sinTheta, 0, 0, -sinTheta, cosTheta, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
    };

    /**
     * Return a Transform which represents composed clockwise
     *    rotations along each of the axes. Equivalent to the result of
     *    Matrix.multiply(rotateX(phi), rotateY(theta), rotateZ(psi)).
     *
     * @method rotate
     * @static
     * @param {Number} phi radians to rotate about the positive x axis
     * @param {Number} theta radians to rotate about the positive y axis
     * @param {Number} psi radians to rotate about the positive z axis
     * @return {Transform}
     */
    Transform.rotate = function rotate(phi, theta, psi) {
        var cosPhi = Math.cos(phi);
        var sinPhi = Math.sin(phi);
        var cosTheta = Math.cos(theta);
        var sinTheta = Math.sin(theta);
        var cosPsi = Math.cos(psi);
        var sinPsi = Math.sin(psi);
        var result = [
            cosTheta * cosPsi,
            cosPhi * sinPsi + sinPhi * sinTheta * cosPsi,
            sinPhi * sinPsi - cosPhi * sinTheta * cosPsi,
            0,
            -cosTheta * sinPsi,
            cosPhi * cosPsi - sinPhi * sinTheta * sinPsi,
            sinPhi * cosPsi + cosPhi * sinTheta * sinPsi,
            0,
            sinTheta,
            -sinPhi * cosTheta,
            cosPhi * cosTheta,
            0,
            0, 0, 0, 1
        ];
        return result;
    };

    /**
     * Return a Transform which represents an axis-angle rotation
     *
     * @method rotateAxis
     * @static
     * @param {Array.Number} v unit vector representing the axis to rotate about
     * @param {Number} theta radians to rotate clockwise about the axis
     * @return {Transform}
     */
    Transform.rotateAxis = function rotateAxis(v, theta) {
        var sinTheta = Math.sin(theta);
        var cosTheta = Math.cos(theta);
        var verTheta = 1 - cosTheta; // versine of theta

        var xxV = v[0] * v[0] * verTheta;
        var xyV = v[0] * v[1] * verTheta;
        var xzV = v[0] * v[2] * verTheta;
        var yyV = v[1] * v[1] * verTheta;
        var yzV = v[1] * v[2] * verTheta;
        var zzV = v[2] * v[2] * verTheta;
        var xs = v[0] * sinTheta;
        var ys = v[1] * sinTheta;
        var zs = v[2] * sinTheta;

        var result = [
            xxV + cosTheta, xyV + zs, xzV - ys, 0,
            xyV - zs, yyV + cosTheta, yzV + xs, 0,
            xzV + ys, yzV - xs, zzV + cosTheta, 0,
            0, 0, 0, 1
        ];
        return result;
    };

    /**
     * Return a Transform which represents a transform matrix applied about
     * a separate origin point.
     *
     * @method aboutOrigin
     * @static
     * @param {Array.Number} v origin point to apply matrix
     * @param {Transform} m matrix to apply
     * @return {Transform}
     */
    Transform.aboutOrigin = function aboutOrigin(v, m) {
        var t0 = v[0] - (v[0] * m[0] + v[1] * m[4] + v[2] * m[8]);
        var t1 = v[1] - (v[0] * m[1] + v[1] * m[5] + v[2] * m[9]);
        var t2 = v[2] - (v[0] * m[2] + v[1] * m[6] + v[2] * m[10]);
        return Transform.thenMove(m, [t0, t1, t2]);
    };

    /**
     * Return a Transform representation of a skew transformation
     *
     * @method skew
     * @static
     * @param {Number} phi scale factor skew in the x axis
     * @param {Number} theta scale factor skew in the y axis
     * @param {Number} psi scale factor skew in the z axis
     * @return {Transform}
     */
    Transform.skew = function skew(phi, theta, psi) {
        return [1, Math.tan(theta), 0, 0, Math.tan(psi), 1, 0, 0, 0, Math.tan(phi), 1, 0, 0, 0, 0, 1];
    };

    /**
     * Return a Transform representation of a skew in the x-direction
     *
     * @method skewX
     * @static
     * @param {Number} angle the angle between the top and left sides
     * @return {Transform}
     */
    Transform.skewX = function skewX(angle) {
        return [1, 0, 0, 0, Math.tan(angle), 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
    };

    /**
     * Return a Transform representation of a skew in the y-direction
     *
     * @method skewY
     * @static
     * @param {Number} angle the angle between the top and right sides
     * @return {Transform}
     */
    Transform.skewY = function skewY(angle) {
        return [1, Math.tan(angle), 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
    };

    /**
     * Returns a perspective Transform matrix
     *
     * @method perspective
     * @static
     * @param {Number} focusZ z position of focal point
     * @return {Transform}
     */
    Transform.perspective = function perspective(focusZ) {
        return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, -1 / focusZ, 0, 0, 0, 1];
    };

    /**
     * Return translation vector component of given Transform
     *
     * @method getTranslate
     * @static
     * @param {Transform} m Transform
     * @return {Array.Number} the translation vector [t_x, t_y, t_z]
     */
    Transform.getTranslate = function getTranslate(m) {
        return [m[12], m[13], m[14]];
    };

    /**
     * Return inverse affine transform for given Transform.
     *   Note: This assumes m[3] = m[7] = m[11] = 0, and m[15] = 1.
     *   Will provide incorrect results if not invertible or preconditions not met.
     *
     * @method inverse
     * @static
     * @param {Transform} m Transform
     * @return {Transform}
     */
    Transform.inverse = function inverse(m) {
        // only need to consider 3x3 section for affine
        var c0 = m[5] * m[10] - m[6] * m[9];
        var c1 = m[4] * m[10] - m[6] * m[8];
        var c2 = m[4] * m[9] - m[5] * m[8];
        var c4 = m[1] * m[10] - m[2] * m[9];
        var c5 = m[0] * m[10] - m[2] * m[8];
        var c6 = m[0] * m[9] - m[1] * m[8];
        var c8 = m[1] * m[6] - m[2] * m[5];
        var c9 = m[0] * m[6] - m[2] * m[4];
        var c10 = m[0] * m[5] - m[1] * m[4];
        var detM = m[0] * c0 - m[1] * c1 + m[2] * c2;
        var invD = 1 / detM;
        var result = [
            invD * c0, -invD * c4, invD * c8, 0,
            -invD * c1, invD * c5, -invD * c9, 0,
            invD * c2, -invD * c6, invD * c10, 0,
            0, 0, 0, 1
        ];
        result[12] = -m[12] * result[0] - m[13] * result[4] - m[14] * result[8];
        result[13] = -m[12] * result[1] - m[13] * result[5] - m[14] * result[9];
        result[14] = -m[12] * result[2] - m[13] * result[6] - m[14] * result[10];
        return result;
    };

    /**
     * Returns the transpose of a 4x4 matrix
     *
     * @method transpose
     * @static
     * @param {Transform} m matrix
     * @return {Transform} the resulting transposed matrix
     */
    Transform.transpose = function transpose(m) {
        return [m[0], m[4], m[8], m[12], m[1], m[5], m[9], m[13], m[2], m[6], m[10], m[14], m[3], m[7], m[11], m[15]];
    };

    function _normSquared(v) {
        return (v.length === 2) ? v[0] * v[0] + v[1] * v[1] : v[0] * v[0] + v[1] * v[1] + v[2] * v[2];
    }
    function _norm(v) {
        return Math.sqrt(_normSquared(v));
    }
    function _sign(n) {
        return (n < 0) ? -1 : 1;
    }

    /**
     * Decompose Transform into separate .translate, .rotate, .scale,
     *    and .skew components.
     *
     * @method interpret
     * @static
     * @param {Transform} M transform matrix
     * @return {Object} matrix spec object with component matrices .translate,
     *    .rotate, .scale, .skew
     */
    Transform.interpret = function interpret(M) {

        // QR decomposition via Householder reflections
        //FIRST ITERATION

        //default Q1 to the identity matrix;
        var x = [M[0], M[1], M[2]];                // first column vector
        var sgn = _sign(x[0]);                     // sign of first component of x (for stability)
        var xNorm = _norm(x);                      // norm of first column vector
        var v = [x[0] + sgn * xNorm, x[1], x[2]];  // v = x + sign(x[0])|x|e1
        var mult = 2 / _normSquared(v);            // mult = 2/v'v

        //bail out if our Matrix is singular
        if (mult >= Infinity) {
            return {translate: Transform.getTranslate(M), rotate: [0, 0, 0], scale: [0, 0, 0], skew: [0, 0, 0]};
        }

        //evaluate Q1 = I - 2vv'/v'v
        var Q1 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1];

        //diagonals
        Q1[0]  = 1 - mult * v[0] * v[0];    // 0,0 entry
        Q1[5]  = 1 - mult * v[1] * v[1];    // 1,1 entry
        Q1[10] = 1 - mult * v[2] * v[2];    // 2,2 entry

        //upper diagonal
        Q1[1] = -mult * v[0] * v[1];        // 0,1 entry
        Q1[2] = -mult * v[0] * v[2];        // 0,2 entry
        Q1[6] = -mult * v[1] * v[2];        // 1,2 entry

        //lower diagonal
        Q1[4] = Q1[1];                      // 1,0 entry
        Q1[8] = Q1[2];                      // 2,0 entry
        Q1[9] = Q1[6];                      // 2,1 entry

        //reduce first column of M
        var MQ1 = Transform.multiply(Q1, M);

        //SECOND ITERATION on (1,1) minor
        var x2 = [MQ1[5], MQ1[6]];
        var sgn2 = _sign(x2[0]);                    // sign of first component of x (for stability)
        var x2Norm = _norm(x2);                     // norm of first column vector
        var v2 = [x2[0] + sgn2 * x2Norm, x2[1]];    // v = x + sign(x[0])|x|e1
        var mult2 = 2 / _normSquared(v2);           // mult = 2/v'v

        //evaluate Q2 = I - 2vv'/v'v
        var Q2 = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1];

        //diagonal
        Q2[5]  = 1 - mult2 * v2[0] * v2[0]; // 1,1 entry
        Q2[10] = 1 - mult2 * v2[1] * v2[1]; // 2,2 entry

        //off diagonals
        Q2[6] = -mult2 * v2[0] * v2[1];     // 2,1 entry
        Q2[9] = Q2[6];                      // 1,2 entry

        //calc QR decomposition. Q = Q1*Q2, R = Q'*M
        var Q = Transform.multiply(Q2, Q1);      //note: really Q transpose
        var R = Transform.multiply(Q, M);

        //remove negative scaling
        var remover = Transform.scale(R[0] < 0 ? -1 : 1, R[5] < 0 ? -1 : 1, R[10] < 0 ? -1 : 1);
        R = Transform.multiply(R, remover);
        Q = Transform.multiply(remover, Q);

        //decompose into rotate/scale/skew matrices
        var result = {};
        result.translate = Transform.getTranslate(M);
        result.rotate = [Math.atan2(-Q[6], Q[10]), Math.asin(Q[2]), Math.atan2(-Q[1], Q[0])];
        if (!result.rotate[0]) {
            result.rotate[0] = 0;
            result.rotate[2] = Math.atan2(Q[4], Q[5]);
        }
        result.scale = [R[0], R[5], R[10]];
        result.skew = [Math.atan2(R[9], result.scale[2]), Math.atan2(R[8], result.scale[2]), Math.atan2(R[4], result.scale[0])];

        //double rotation workaround
        if (Math.abs(result.rotate[0]) + Math.abs(result.rotate[2]) > 1.5 * Math.PI) {
            result.rotate[1] = Math.PI - result.rotate[1];
            if (result.rotate[1] > Math.PI) result.rotate[1] -= 2 * Math.PI;
            if (result.rotate[1] < -Math.PI) result.rotate[1] += 2 * Math.PI;
            if (result.rotate[0] < 0) result.rotate[0] += Math.PI;
            else result.rotate[0] -= Math.PI;
            if (result.rotate[2] < 0) result.rotate[2] += Math.PI;
            else result.rotate[2] -= Math.PI;
        }

        return result;
    };

    /**
     * Weighted average between two matrices by averaging their
     *     translation, rotation, scale, skew components.
     *     f(M1,M2,t) = (1 - t) * M1 + t * M2
     *
     * @method average
     * @static
     * @param {Transform} M1 f(M1,M2,0) = M1
     * @param {Transform} M2 f(M1,M2,1) = M2
     * @param {Number} t
     * @return {Transform}
     */
    Transform.average = function average(M1, M2, t) {
        t = (t === undefined) ? 0.5 : t;
        var specM1 = Transform.interpret(M1);
        var specM2 = Transform.interpret(M2);

        var specAvg = {
            translate: [0, 0, 0],
            rotate: [0, 0, 0],
            scale: [0, 0, 0],
            skew: [0, 0, 0]
        };

        for (var i = 0; i < 3; i++) {
            specAvg.translate[i] = (1 - t) * specM1.translate[i] + t * specM2.translate[i];
            specAvg.rotate[i] = (1 - t) * specM1.rotate[i] + t * specM2.rotate[i];
            specAvg.scale[i] = (1 - t) * specM1.scale[i] + t * specM2.scale[i];
            specAvg.skew[i] = (1 - t) * specM1.skew[i] + t * specM2.skew[i];
        }
        return Transform.build(specAvg);
    };

    /**
     * Compose .translate, .rotate, .scale, .skew components into
     * Transform matrix
     *
     * @method build
     * @static
     * @param {matrixSpec} spec object with component matrices .translate,
     *    .rotate, .scale, .skew
     * @return {Transform} composed transform
     */
    Transform.build = function build(spec) {
        var scaleMatrix = Transform.scale(spec.scale[0], spec.scale[1], spec.scale[2]);
        var skewMatrix = Transform.skew(spec.skew[0], spec.skew[1], spec.skew[2]);
        var rotateMatrix = Transform.rotate(spec.rotate[0], spec.rotate[1], spec.rotate[2]);
        return Transform.thenMove(Transform.multiply(Transform.multiply(rotateMatrix, skewMatrix), scaleMatrix), spec.translate);
    };

    /**
     * Determine if two Transforms are component-wise equal
     *   Warning: breaks on perspective Transforms
     *
     * @method equals
     * @static
     * @param {Transform} a matrix
     * @param {Transform} b matrix
     * @return {boolean}
     */
    Transform.equals = function equals(a, b) {
        return !Transform.notEquals(a, b);
    };

    /**
     * Determine if two Transforms are component-wise unequal
     *   Warning: breaks on perspective Transforms
     *
     * @method notEquals
     * @static
     * @param {Transform} a matrix
     * @param {Transform} b matrix
     * @return {boolean}
     */
    Transform.notEquals = function notEquals(a, b) {
        if (a === b) return false;

        // shortci
        return !(a && b) ||
            a[12] !== b[12] || a[13] !== b[13] || a[14] !== b[14] ||
            a[0] !== b[0] || a[1] !== b[1] || a[2] !== b[2] ||
            a[4] !== b[4] || a[5] !== b[5] || a[6] !== b[6] ||
            a[8] !== b[8] || a[9] !== b[9] || a[10] !== b[10];
    };

    /**
     * Constrain angle-trio components to range of [-pi, pi).
     *
     * @method normalizeRotation
     * @static
     * @param {Array.Number} rotation phi, theta, psi (array of floats
     *    && array.length == 3)
     * @return {Array.Number} new phi, theta, psi triplet
     *    (array of floats && array.length == 3)
     */
    Transform.normalizeRotation = function normalizeRotation(rotation) {
        var result = rotation.slice(0);
        if (result[0] === Math.PI * 0.5 || result[0] === -Math.PI * 0.5) {
            result[0] = -result[0];
            result[1] = Math.PI - result[1];
            result[2] -= Math.PI;
        }
        if (result[0] > Math.PI * 0.5) {
            result[0] = result[0] - Math.PI;
            result[1] = Math.PI - result[1];
            result[2] -= Math.PI;
        }
        if (result[0] < -Math.PI * 0.5) {
            result[0] = result[0] + Math.PI;
            result[1] = -Math.PI - result[1];
            result[2] -= Math.PI;
        }
        while (result[1] < -Math.PI) result[1] += 2 * Math.PI;
        while (result[1] >= Math.PI) result[1] -= 2 * Math.PI;
        while (result[2] < -Math.PI) result[2] += 2 * Math.PI;
        while (result[2] >= Math.PI) result[2] -= 2 * Math.PI;
        return result;
    };

    /**
     * (Property) Array defining a translation forward in z by 1
     *
     * @property {array} inFront
     * @static
     * @final
     */
    Transform.inFront = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1e-3, 1];

    /**
     * (Property) Array defining a translation backwards in z by 1
     *
     * @property {array} behind
     * @static
     * @final
     */
    Transform.behind = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, -1e-3, 1];

    module.exports = Transform;
});

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: mark@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define('famous/core/SpecParser',['require','exports','module','./Transform'],function(require, exports, module) {
    var Transform = require('./Transform');

    /**
     *
     * This object translates the rendering instructions ("render specs")
     *   that renderable components generate into document update
     *   instructions ("update specs").  Private.
     *
     * @private
     * @class SpecParser
     * @constructor
     */
    function SpecParser() {
        this.result = {};
    }
    SpecParser._instance = new SpecParser();

    /**
     * Convert a render spec coming from the context's render chain to an
     *    update spec for the update chain. This is the only major entry point
     *    for a consumer of this class.
     *
     * @method parse
     * @static
     * @private
     *
     * @param {renderSpec} spec input render spec
     * @param {Object} context context to do the parse in
     * @return {Object} the resulting update spec (if no callback
     *   specified, else none)
     */
    SpecParser.parse = function parse(spec, context) {
        return SpecParser._instance.parse(spec, context);
    };

    /**
     * Convert a renderSpec coming from the context's render chain to an update
     *    spec for the update chain. This is the only major entrypoint for a
     *    consumer of this class.
     *
     * @method parse
     *
     * @private
     * @param {renderSpec} spec input render spec
     * @param {Context} context
     * @return {updateSpec} the resulting update spec
     */
    SpecParser.prototype.parse = function parse(spec, context) {
        this.reset();
        this._parseSpec(spec, context, Transform.identity);
        return this.result;
    };

    /**
     * Prepare SpecParser for re-use (or first use) by setting internal state
     *  to blank.
     *
     * @private
     * @method reset
     */
    SpecParser.prototype.reset = function reset() {
        this.result = {};
    };

    // Multiply matrix M by vector v
    function _vecInContext(v, m) {
        return [
            v[0] * m[0] + v[1] * m[4] + v[2] * m[8],
            v[0] * m[1] + v[1] * m[5] + v[2] * m[9],
            v[0] * m[2] + v[1] * m[6] + v[2] * m[10]
        ];
    }

    var _zeroZero = [0, 0];

    // From the provided renderSpec tree, recursively compose opacities,
    //    origins, transforms, and sizes corresponding to each surface id from
    //    the provided renderSpec tree structure. On completion, those
    //    properties of 'this' object should be ready to use to build an
    //    updateSpec.
    SpecParser.prototype._parseSpec = function _parseSpec(spec, parentContext, sizeContext) {
        var id;
        var target;
        var transform;
        var opacity;
        var origin;
        var align;
        var size;

        if (typeof spec === 'number') {
            id = spec;
            transform = parentContext.transform;
            align = parentContext.align || _zeroZero;
            if (parentContext.size && align && (align[0] || align[1])) {
                var alignAdjust = [align[0] * parentContext.size[0], align[1] * parentContext.size[1], 0];
                transform = Transform.thenMove(transform, _vecInContext(alignAdjust, sizeContext));
            }
            this.result[id] = {
                transform: transform,
                opacity: parentContext.opacity,
                origin: parentContext.origin || _zeroZero,
                align: parentContext.align || _zeroZero,
                size: parentContext.size
            };
        }
        else if (!spec) { // placed here so 0 will be cached earlier
            return;
        }
        else if (spec instanceof Array) {
            for (var i = 0; i < spec.length; i++) {
                this._parseSpec(spec[i], parentContext, sizeContext);
            }
        }
        else {
            target = spec.target;
            transform = parentContext.transform;
            opacity = parentContext.opacity;
            origin = parentContext.origin;
            align = parentContext.align;
            size = parentContext.size;
            var nextSizeContext = sizeContext;

            if (spec.opacity !== undefined) opacity = parentContext.opacity * spec.opacity;
            if (spec.transform) transform = Transform.multiply(parentContext.transform, spec.transform);
            if (spec.origin) {
                origin = spec.origin;
                nextSizeContext = parentContext.transform;
            }
            if (spec.align) align = spec.align;

            if (spec.size || spec.proportions) {
                var parentSize = size;
                size = [size[0], size[1]];

                if (spec.size) {
                    if (spec.size[0] !== undefined) size[0] = spec.size[0];
                    if (spec.size[1] !== undefined) size[1] = spec.size[1];
                }

                if (spec.proportions) {
                    if (spec.proportions[0] !== undefined) size[0] = size[0] * spec.proportions[0];
                    if (spec.proportions[1] !== undefined) size[1] = size[1] * spec.proportions[1];
                }

                if (parentSize) {
                    if (align && (align[0] || align[1])) transform = Transform.thenMove(transform, _vecInContext([align[0] * parentSize[0], align[1] * parentSize[1], 0], sizeContext));
                    if (origin && (origin[0] || origin[1])) transform = Transform.moveThen([-origin[0] * size[0], -origin[1] * size[1], 0], transform);
                }

                nextSizeContext = parentContext.transform;
                origin = null;
                align = null;
            }

            this._parseSpec(target, {
                transform: transform,
                opacity: opacity,
                origin: origin,
                align: align,
                size: size
            }, nextSizeContext);
        }
    };

    module.exports = SpecParser;
});

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: mark@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define('famous/core/RenderNode',['require','exports','module','./Entity','./SpecParser'],function(require, exports, module) {
    var Entity = require('./Entity');
    var SpecParser = require('./SpecParser');

    /**
     * A wrapper for inserting a renderable component (like a Modifer or
     *   Surface) into the render tree.
     *
     * @class RenderNode
     * @constructor
     *
     * @param {Object} object Target renderable component
     */
    function RenderNode(object) {
        this._object = null;
        this._child = null;
        this._hasMultipleChildren = false;
        this._isRenderable = false;
        this._isModifier = false;

        this._resultCache = {};
        this._prevResults = {};

        this._childResult = null;

        if (object) this.set(object);
    }

    /**
     * Append a renderable to the list of this node's children.
     *   This produces a new RenderNode in the tree.
     *   Note: Does not double-wrap if child is a RenderNode already.
     *
     * @method add
     * @param {Object} child renderable object
     * @return {RenderNode} new render node wrapping child
     */
    RenderNode.prototype.add = function add(child) {
        var childNode = (child instanceof RenderNode) ? child : new RenderNode(child);
        if (this._child instanceof Array) this._child.push(childNode);
        else if (this._child) {
            this._child = [this._child, childNode];
            this._hasMultipleChildren = true;
            this._childResult = []; // to be used later
        }
        else this._child = childNode;

        return childNode;
    };

    /**
     * Return the single wrapped object.  Returns null if this node has multiple child nodes.
     *
     * @method get
     *
     * @return {Ojbect} contained renderable object
     */
    RenderNode.prototype.get = function get() {
        return this._object || (this._hasMultipleChildren ? null : (this._child ? this._child.get() : null));
    };

    /**
     * Overwrite the list of children to contain the single provided object
     *
     * @method set
     * @param {Object} child renderable object
     * @return {RenderNode} this render node, or child if it is a RenderNode
     */
    RenderNode.prototype.set = function set(child) {
        this._childResult = null;
        this._hasMultipleChildren = false;
        this._isRenderable = child.render ? true : false;
        this._isModifier = child.modify ? true : false;
        this._object = child;
        this._child = null;
        if (child instanceof RenderNode) return child;
        else return this;
    };

    /**
     * Get render size of contained object.
     *
     * @method getSize
     * @return {Array.Number} size of this or size of single child.
     */
    RenderNode.prototype.getSize = function getSize() {
        var result = null;
        var target = this.get();
        if (target && target.getSize) result = target.getSize();
        if (!result && this._child && this._child.getSize) result = this._child.getSize();
        return result;
    };

    // apply results of rendering this subtree to the document
    function _applyCommit(spec, context, cacheStorage) {
        var result = SpecParser.parse(spec, context);
        var keys = Object.keys(result);
        for (var i = 0; i < keys.length; i++) {
            var id = keys[i];
            var childNode = Entity.get(id);
            var commitParams = result[id];
            commitParams.allocator = context.allocator;
            var commitResult = childNode.commit(commitParams);
            if (commitResult) _applyCommit(commitResult, context, cacheStorage);
            else cacheStorage[id] = commitParams;
        }
    }

    /**
     * Commit the content change from this node to the document.
     *
     * @private
     * @method commit
     * @param {Context} context render context
     */
    RenderNode.prototype.commit = function commit(context) {
        // free up some divs from the last loop
        var prevKeys = Object.keys(this._prevResults);
        for (var i = 0; i < prevKeys.length; i++) {
            var id = prevKeys[i];
            if (this._resultCache[id] === undefined) {
                var object = Entity.get(id);
                if (object.cleanup) object.cleanup(context.allocator);
            }
        }

        this._prevResults = this._resultCache;
        this._resultCache = {};
        _applyCommit(this.render(), context, this._resultCache);
    };

    /**
     * Generate a render spec from the contents of the wrapped component.
     *
     * @private
     * @method render
     *
     * @return {Object} render specification for the component subtree
     *    only under this node.
     */
    RenderNode.prototype.render = function render() {
        if (this._isRenderable) return this._object.render();

        var result = null;
        if (this._hasMultipleChildren) {
            result = this._childResult;
            var children = this._child;
            for (var i = 0; i < children.length; i++) {
                result[i] = children[i].render();
            }
        }
        else if (this._child) result = this._child.render();

        return this._isModifier ? this._object.modify(result) : result;
    };

    module.exports = RenderNode;
});

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: mark@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define('famous/core/EventEmitter',['require','exports','module'],function(require, exports, module) {
    /**
     * EventEmitter represents a channel for events.
     *
     * @class EventEmitter
     * @constructor
     */
    function EventEmitter() {
        this.listeners = {};
        this._owner = this;
    }

    /**
     * Trigger an event, sending to all downstream handlers
     *   listening for provided 'type' key.
     *
     * @method emit
     *
     * @param {string} type event type key (for example, 'click')
     * @param {Object} event event data
     * @return {EventHandler} this
     */
    EventEmitter.prototype.emit = function emit(type, event) {
        var handlers = this.listeners[type];
        if (handlers) {
            for (var i = 0; i < handlers.length; i++) {
                handlers[i].call(this._owner, event);
            }
        }
        return this;
    };

    /**
     * Bind a callback function to an event type handled by this object.
     *
     * @method "on"
     *
     * @param {string} type event type key (for example, 'click')
     * @param {function(string, Object)} handler callback
     * @return {EventHandler} this
     */
   EventEmitter.prototype.on = function on(type, handler) {
        if (!(type in this.listeners)) this.listeners[type] = [];
        var index = this.listeners[type].indexOf(handler);
        if (index < 0) this.listeners[type].push(handler);
        return this;
    };

    /**
     * Alias for "on".
     * @method addListener
     */
    EventEmitter.prototype.addListener = EventEmitter.prototype.on;

   /**
     * Unbind an event by type and handler.
     *   This undoes the work of "on".
     *
     * @method removeListener
     *
     * @param {string} type event type key (for example, 'click')
     * @param {function} handler function object to remove
     * @return {EventEmitter} this
     */
    EventEmitter.prototype.removeListener = function removeListener(type, handler) {
        var listener = this.listeners[type];
        if (listener !== undefined) {
            var index = listener.indexOf(handler);
            if (index >= 0) listener.splice(index, 1);
        }
        return this;
    };

    /**
     * Call event handlers with this set to owner.
     *
     * @method bindThis
     *
     * @param {Object} owner object this EventEmitter belongs to
     */
    EventEmitter.prototype.bindThis = function bindThis(owner) {
        this._owner = owner;
    };

    module.exports = EventEmitter;
});

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: mark@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define('famous/core/EventHandler',['require','exports','module','./EventEmitter'],function(require, exports, module) {
    var EventEmitter = require('./EventEmitter');

    /**
     * EventHandler forwards received events to a set of provided callback functions.
     * It allows events to be captured, processed, and optionally piped through to other event handlers.
     *
     * @class EventHandler
     * @extends EventEmitter
     * @constructor
     */
    function EventHandler() {
        EventEmitter.apply(this, arguments);

        this.downstream = []; // downstream event handlers
        this.downstreamFn = []; // downstream functions

        this.upstream = []; // upstream event handlers
        this.upstreamListeners = {}; // upstream listeners
    }
    EventHandler.prototype = Object.create(EventEmitter.prototype);
    EventHandler.prototype.constructor = EventHandler;

    /**
     * Assign an event handler to receive an object's input events.
     *
     * @method setInputHandler
     * @static
     *
     * @param {Object} object object to mix trigger, subscribe, and unsubscribe functions into
     * @param {EventHandler} handler assigned event handler
     */
    EventHandler.setInputHandler = function setInputHandler(object, handler) {
        object.trigger = handler.trigger.bind(handler);
        if (handler.subscribe && handler.unsubscribe) {
            object.subscribe = handler.subscribe.bind(handler);
            object.unsubscribe = handler.unsubscribe.bind(handler);
        }
    };

    /**
     * Assign an event handler to receive an object's output events.
     *
     * @method setOutputHandler
     * @static
     *
     * @param {Object} object object to mix pipe, unpipe, on, addListener, and removeListener functions into
     * @param {EventHandler} handler assigned event handler
     */
    EventHandler.setOutputHandler = function setOutputHandler(object, handler) {
        if (handler instanceof EventHandler) handler.bindThis(object);
        object.pipe = handler.pipe.bind(handler);
        object.unpipe = handler.unpipe.bind(handler);
        object.on = handler.on.bind(handler);
        object.addListener = object.on;
        object.removeListener = handler.removeListener.bind(handler);
    };

    /**
     * Trigger an event, sending to all downstream handlers
     *   listening for provided 'type' key.
     *
     * @method emit
     *
     * @param {string} type event type key (for example, 'click')
     * @param {Object} event event data
     * @return {EventHandler} this
     */
    EventHandler.prototype.emit = function emit(type, event) {
        EventEmitter.prototype.emit.apply(this, arguments);
        var i = 0;
        for (i = 0; i < this.downstream.length; i++) {
            if (this.downstream[i].trigger) this.downstream[i].trigger(type, event);
        }
        for (i = 0; i < this.downstreamFn.length; i++) {
            this.downstreamFn[i](type, event);
        }
        return this;
    };

    /**
     * Alias for emit
     * @method addListener
     */
    EventHandler.prototype.trigger = EventHandler.prototype.emit;

    /**
     * Add event handler object to set of downstream handlers.
     *
     * @method pipe
     *
     * @param {EventHandler} target event handler target object
     * @return {EventHandler} passed event handler
     */
    EventHandler.prototype.pipe = function pipe(target) {
        if (target.subscribe instanceof Function) return target.subscribe(this);

        var downstreamCtx = (target instanceof Function) ? this.downstreamFn : this.downstream;
        var index = downstreamCtx.indexOf(target);
        if (index < 0) downstreamCtx.push(target);

        if (target instanceof Function) target('pipe', null);
        else if (target.trigger) target.trigger('pipe', null);

        return target;
    };

    /**
     * Remove handler object from set of downstream handlers.
     *   Undoes work of "pipe".
     *
     * @method unpipe
     *
     * @param {EventHandler} target target handler object
     * @return {EventHandler} provided target
     */
    EventHandler.prototype.unpipe = function unpipe(target) {
        if (target.unsubscribe instanceof Function) return target.unsubscribe(this);

        var downstreamCtx = (target instanceof Function) ? this.downstreamFn : this.downstream;
        var index = downstreamCtx.indexOf(target);
        if (index >= 0) {
            downstreamCtx.splice(index, 1);
            if (target instanceof Function) target('unpipe', null);
            else if (target.trigger) target.trigger('unpipe', null);
            return target;
        }
        else return false;
    };

    /**
     * Bind a callback function to an event type handled by this object.
     *
     * @method "on"
     *
     * @param {string} type event type key (for example, 'click')
     * @param {function(string, Object)} handler callback
     * @return {EventHandler} this
     */
    EventHandler.prototype.on = function on(type, handler) {
        EventEmitter.prototype.on.apply(this, arguments);
        if (!(type in this.upstreamListeners)) {
            var upstreamListener = this.trigger.bind(this, type);
            this.upstreamListeners[type] = upstreamListener;
            for (var i = 0; i < this.upstream.length; i++) {
                this.upstream[i].on(type, upstreamListener);
            }
        }
        return this;
    };

    /**
     * Alias for "on"
     * @method addListener
     */
    EventHandler.prototype.addListener = EventHandler.prototype.on;

    /**
     * Listen for events from an upstream event handler.
     *
     * @method subscribe
     *
     * @param {EventEmitter} source source emitter object
     * @return {EventHandler} this
     */
    EventHandler.prototype.subscribe = function subscribe(source) {
        var index = this.upstream.indexOf(source);
        if (index < 0) {
            this.upstream.push(source);
            for (var type in this.upstreamListeners) {
                source.on(type, this.upstreamListeners[type]);
            }
        }
        return this;
    };

    /**
     * Stop listening to events from an upstream event handler.
     *
     * @method unsubscribe
     *
     * @param {EventEmitter} source source emitter object
     * @return {EventHandler} this
     */
    EventHandler.prototype.unsubscribe = function unsubscribe(source) {
        var index = this.upstream.indexOf(source);
        if (index >= 0) {
            this.upstream.splice(index, 1);
            for (var type in this.upstreamListeners) {
                source.removeListener(type, this.upstreamListeners[type]);
            }
        }
        return this;
    };

    module.exports = EventHandler;
});

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: mark@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define('famous/core/ElementAllocator',['require','exports','module'],function(require, exports, module) {

    /**
     * Internal helper object to Context that handles the process of
     *   creating and allocating DOM elements within a managed div.
     *   Private.
     *
     * @class ElementAllocator
     * @constructor
     * @private
     * @param {Node} container document element in which Famo.us content will be inserted
     */
    function ElementAllocator(container) {
        if (!container) container = document.createDocumentFragment();
        this.container = container;
        this.detachedNodes = {};
        this.nodeCount = 0;
    }

    /**
     * Move the document elements from their original container to a new one.
     *
     * @private
     * @method migrate
     *
     * @param {Node} container document element to which Famo.us content will be migrated
     */
    ElementAllocator.prototype.migrate = function migrate(container) {
        var oldContainer = this.container;
        if (container === oldContainer) return;

        if (oldContainer instanceof DocumentFragment) {
            container.appendChild(oldContainer);
        }
        else {
            while (oldContainer.hasChildNodes()) {
                container.appendChild(oldContainer.firstChild);
            }
        }

        this.container = container;
    };

    /**
     * Allocate an element of specified type from the pool.
     *
     * @private
     * @method allocate
     *
     * @param {string} type type of element, e.g. 'div'
     * @return {Node} allocated document element
     */
    ElementAllocator.prototype.allocate = function allocate(type) {
        type = type.toLowerCase();
        if (!(type in this.detachedNodes)) this.detachedNodes[type] = [];
        var nodeStore = this.detachedNodes[type];
        var result;
        if (nodeStore.length > 0) {
            result = nodeStore.pop();
        }
        else {
            result = document.createElement(type);
            this.container.appendChild(result);
        }
        this.nodeCount++;
        return result;
    };

    /**
     * De-allocate an element of specified type to the pool.
     *
     * @private
     * @method deallocate
     *
     * @param {Node} element document element to deallocate
     */
    ElementAllocator.prototype.deallocate = function deallocate(element) {
        var nodeType = element.nodeName.toLowerCase();
        var nodeStore = this.detachedNodes[nodeType];
        nodeStore.push(element);
        this.nodeCount--;
    };

    /**
     * Get count of total allocated nodes in the document.
     *
     * @private
     * @method getNodeCount
     *
     * @return {Number} total node count
     */
    ElementAllocator.prototype.getNodeCount = function getNodeCount() {
        return this.nodeCount;
    };

    module.exports = ElementAllocator;
});

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: mark@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define('famous/utilities/Utility',['require','exports','module'],function(require, exports, module) {
    /**
     * This namespace holds standalone functionality.
     *  Currently includes name mapping for transition curves,
     *  name mapping for origin pairs, and the after() function.
     *
     * @class Utility
     * @static
     */
    var Utility = {};

    /**
     * Table of direction array positions
     *
     * @property {object} Direction
     * @final
     */
    Utility.Direction = {
        X: 0,
        Y: 1,
        Z: 2
    };

    /**
     * Return wrapper around callback function. Once the wrapper is called N
     *   times, invoke the callback function. Arguments and scope preserved.
     *
     * @method after
     *
     * @param {number} count number of calls before callback function invoked
     * @param {Function} callback wrapped callback function
     *
     * @return {function} wrapped callback with coundown feature
     */
    Utility.after = function after(count, callback) {
        var counter = count;
        return function() {
            counter--;
            if (counter === 0) callback.apply(this, arguments);
        };
    };

    /**
     * Load a URL and return its contents in a callback
     *
     * @method loadURL
     *
     * @param {string} url URL of object
     * @param {function} callback callback to dispatch with content
     */
    Utility.loadURL = function loadURL(url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function onreadystatechange() {
            if (this.readyState === 4) {
                if (callback) callback(this.responseText);
            }
        };
        xhr.open('GET', url);
        xhr.send();
    };

    /**
     * Create a document fragment from a string of HTML
     *
     * @method createDocumentFragmentFromHTML
     *
     * @param {string} html HTML to convert to DocumentFragment
     *
     * @return {DocumentFragment} DocumentFragment representing input HTML
     */
    Utility.createDocumentFragmentFromHTML = function createDocumentFragmentFromHTML(html) {
        var element = document.createElement('div');
        element.innerHTML = html;
        var result = document.createDocumentFragment();
        while (element.hasChildNodes()) result.appendChild(element.firstChild);
        return result;
    };

    /*
     *  Deep clone an object.
     *  @param b {Object} Object to clone
     *  @return a {Object} Cloned object.
     */
    Utility.clone = function clone(b) {
        var a;
        if (typeof b === 'object') {
            a = (b instanceof Array) ? [] : {};
            for (var key in b) {
                if (typeof b[key] === 'object' && b[key] !== null) {
                    if (b[key] instanceof Array) {
                        a[key] = new Array(b[key].length);
                        for (var i = 0; i < b[key].length; i++) {
                            a[key][i] = Utility.clone(b[key][i]);
                        }
                    }
                    else {
                      a[key] = Utility.clone(b[key]);
                    }
                }
                else {
                    a[key] = b[key];
                }
            }
        }
        else {
            a = b;
        }
        return a;
    };

    module.exports = Utility;
});

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: david@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define('famous/transitions/MultipleTransition',['require','exports','module','../utilities/Utility'],function(require, exports, module) {
    var Utility = require('../utilities/Utility');

    /**
     * Transition meta-method to support transitioning multiple
     *   values with scalar-only methods.
     *
     *
     * @class MultipleTransition
     * @constructor
     *
     * @param {Object} method Transionable class to multiplex
     */
    function MultipleTransition(method) {
        this.method = method;
        this._instances = [];
        this.state = [];
    }

    MultipleTransition.SUPPORTS_MULTIPLE = true;

    /**
     * Get the state of each transition.
     *
     * @method get
     *
     * @return state {Number|Array} state array
     */
    MultipleTransition.prototype.get = function get() {
        for (var i = 0; i < this._instances.length; i++) {
            this.state[i] = this._instances[i].get();
        }
        return this.state;
    };

    /**
     * Set the end states with a shared transition, with optional callback.
     *
     * @method set
     *
     * @param {Number|Array} endState Final State.  Use a multi-element argument for multiple transitions.
     * @param {Object} transition Transition definition, shared among all instances
     * @param {Function} callback called when all endStates have been reached.
     */
    MultipleTransition.prototype.set = function set(endState, transition, callback) {
        var _allCallback = Utility.after(endState.length, callback);
        for (var i = 0; i < endState.length; i++) {
            if (!this._instances[i]) this._instances[i] = new (this.method)();
            this._instances[i].set(endState[i], transition, _allCallback);
        }
    };

    /**
     * Reset all transitions to start state.
     *
     * @method reset
     *
     * @param  {Number|Array} startState Start state
     */
    MultipleTransition.prototype.reset = function reset(startState) {
        for (var i = 0; i < startState.length; i++) {
            if (!this._instances[i]) this._instances[i] = new (this.method)();
            this._instances[i].reset(startState[i]);
        }
    };

    module.exports = MultipleTransition;
});

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: david@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define('famous/transitions/TweenTransition',['require','exports','module'],function(require, exports, module) {

    /**
     *
     * A state maintainer for a smooth transition between
     *    numerically-specified states.  Example numeric states include floats or
     *    Transfornm objects.
     *
     *    An initial state is set with the constructor or set(startValue). A
     *    corresponding end state and transition are set with set(endValue,
     *    transition). Subsequent calls to set(endValue, transition) begin at
     *    the last state. Calls to get(timestamp) provide the _interpolated state
     *    along the way.
     *
     *   Note that there is no event loop here - calls to get() are the only way
     *    to find out state projected to the current (or provided) time and are
     *    the only way to trigger callbacks. Usually this kind of object would
     *    be part of the render() path of a visible component.
     *
     * @class TweenTransition
     * @constructor
     *
     * @param {Object} options TODO
     *    beginning state
     */
    function TweenTransition(options) {
        this.options = Object.create(TweenTransition.DEFAULT_OPTIONS);
        if (options) this.setOptions(options);

        this._startTime = 0;
        this._startValue = 0;
        this._updateTime = 0;
        this._endValue = 0;
        this._curve = undefined;
        this._duration = 0;
        this._active = false;
        this._callback = undefined;
        this.state = 0;
        this.velocity = undefined;
    }

    /**
     * Transition curves mapping independent variable t from domain [0,1] to a
     *    range within [0,1]. Includes functions 'linear', 'easeIn', 'easeOut',
     *    'easeInOut', 'easeOutBounce', 'spring'.
     *
     * @property {object} Curve
     * @final
     */
    TweenTransition.Curves = {
        linear: function(t) {
            return t;
        },
        easeIn: function(t) {
            return t*t;
        },
        easeOut: function(t) {
            return t*(2-t);
        },
        easeInOut: function(t) {
            if (t <= 0.5) return 2*t*t;
            else return -2*t*t + 4*t - 1;
        },
        easeOutBounce: function(t) {
            return t*(3 - 2*t);
        },
        spring: function(t) {
            return (1 - t) * Math.sin(6 * Math.PI * t) + t;
        }
    };

    TweenTransition.SUPPORTS_MULTIPLE = true;
    TweenTransition.DEFAULT_OPTIONS = {
        curve: TweenTransition.Curves.linear,
        duration: 500,
        speed: 0 /* considered only if positive */
    };

    var registeredCurves = {};

    /**
     * Add "unit" curve to internal dictionary of registered curves.
     *
     * @method registerCurve
     *
     * @static
     *
     * @param {string} curveName dictionary key
     * @param {unitCurve} curve function of one numeric variable mapping [0,1]
     *    to range inside [0,1]
     * @return {boolean} false if key is taken, else true
     */
    TweenTransition.registerCurve = function registerCurve(curveName, curve) {
        if (!registeredCurves[curveName]) {
            registeredCurves[curveName] = curve;
            return true;
        }
        else {
            return false;
        }
    };

    /**
     * Remove object with key "curveName" from internal dictionary of registered
     *    curves.
     *
     * @method unregisterCurve
     *
     * @static
     *
     * @param {string} curveName dictionary key
     * @return {boolean} false if key has no dictionary value
     */
    TweenTransition.unregisterCurve = function unregisterCurve(curveName) {
        if (registeredCurves[curveName]) {
            delete registeredCurves[curveName];
            return true;
        }
        else {
            return false;
        }
    };

    /**
     * Retrieve function with key "curveName" from internal dictionary of
     *    registered curves. Default curves are defined in the
     *    TweenTransition.Curves array, where the values represent
     *    unitCurve functions.
     *
     * @method getCurve
     *
     * @static
     *
     * @param {string} curveName dictionary key
     * @return {unitCurve} curve function of one numeric variable mapping [0,1]
     *    to range inside [0,1]
     */
    TweenTransition.getCurve = function getCurve(curveName) {
        var curve = registeredCurves[curveName];
        if (curve !== undefined) return curve;
        else throw new Error('curve not registered');
    };

    /**
     * Retrieve all available curves.
     *
     * @method getCurves
     *
     * @static
     *
     * @return {object} curve functions of one numeric variable mapping [0,1]
     *    to range inside [0,1]
     */
    TweenTransition.getCurves = function getCurves() {
        return registeredCurves;
    };

     // Interpolate: If a linear function f(0) = a, f(1) = b, then return f(t)
    function _interpolate(a, b, t) {
        return ((1 - t) * a) + (t * b);
    }

    function _clone(obj) {
        if (obj instanceof Object) {
            if (obj instanceof Array) return obj.slice(0);
            else return Object.create(obj);
        }
        else return obj;
    }

    // Fill in missing properties in "transition" with those in defaultTransition, and
    //   convert internal named curve to function object, returning as new
    //   object.
    function _normalize(transition, defaultTransition) {
        var result = {curve: defaultTransition.curve};
        if (defaultTransition.duration) result.duration = defaultTransition.duration;
        if (defaultTransition.speed) result.speed = defaultTransition.speed;
        if (transition instanceof Object) {
            if (transition.duration !== undefined) result.duration = transition.duration;
            if (transition.curve) result.curve = transition.curve;
            if (transition.speed) result.speed = transition.speed;
        }
        if (typeof result.curve === 'string') result.curve = TweenTransition.getCurve(result.curve);
        return result;
    }

    /**
     * Set internal options, overriding any default options.
     *
     * @method setOptions
     *
     *
     * @param {Object} options options object
     * @param {Object} [options.curve] function mapping [0,1] to [0,1] or identifier
     * @param {Number} [options.duration] duration in ms
     * @param {Number} [options.speed] speed in pixels per ms
     */
    TweenTransition.prototype.setOptions = function setOptions(options) {
        if (options.curve !== undefined) this.options.curve = options.curve;
        if (options.duration !== undefined) this.options.duration = options.duration;
        if (options.speed !== undefined) this.options.speed = options.speed;
    };

    /**
     * Add transition to end state to the queue of pending transitions. Special
     *    Use: calling without a transition resets the object to that state with
     *    no pending actions
     *
     * @method set
     *
     *
     * @param {number|FamousMatrix|Array.Number|Object.<number, number>} endValue
     *    end state to which we _interpolate
     * @param {transition=} transition object of type {duration: number, curve:
     *    f[0,1] -> [0,1] or name}. If transition is omitted, change will be
     *    instantaneous.
     * @param {function()=} callback Zero-argument function to call on observed
     *    completion (t=1)
     */
    TweenTransition.prototype.set = function set(endValue, transition, callback) {
        if (!transition) {
            this.reset(endValue);
            if (callback) callback();
            return;
        }

        this._startValue = _clone(this.get());
        transition = _normalize(transition, this.options);
        if (transition.speed) {
            var startValue = this._startValue;
            if (startValue instanceof Object) {
                var variance = 0;
                for (var i in startValue) variance += (endValue[i] - startValue[i]) * (endValue[i] - startValue[i]);
                transition.duration = Math.sqrt(variance) / transition.speed;
            }
            else {
                transition.duration = Math.abs(endValue - startValue) / transition.speed;
            }
        }

        this._startTime = Date.now();
        this._endValue = _clone(endValue);
        this._startVelocity = _clone(transition.velocity);
        this._duration = transition.duration;
        this._curve = transition.curve;
        this._active = true;
        this._callback = callback;
    };

    /**
     * Cancel all transitions and reset to a stable state
     *
     * @method reset
     *
     * @param {number|Array.Number|Object.<number, number>} startValue
     *    starting state
     * @param {number} startVelocity
     *    starting velocity
     */
    TweenTransition.prototype.reset = function reset(startValue, startVelocity) {
        if (this._callback) {
            var callback = this._callback;
            this._callback = undefined;
            callback();
        }
        this.state = _clone(startValue);
        this.velocity = _clone(startVelocity);
        this._startTime = 0;
        this._duration = 0;
        this._updateTime = 0;
        this._startValue = this.state;
        this._startVelocity = this.velocity;
        this._endValue = this.state;
        this._active = false;
    };

    /**
     * Get current velocity
     *
     * @method getVelocity
     *
     * @returns {Number} velocity
     */
    TweenTransition.prototype.getVelocity = function getVelocity() {
        return this.velocity;
    };

    /**
     * Get interpolated state of current action at provided time. If the last
     *    action has completed, invoke its callback.
     *
     * @method get
     *
     *
     * @param {number=} timestamp Evaluate the curve at a normalized version of this
     *    time. If omitted, use current time. (Unix epoch time)
     * @return {number|Object.<number|string, number>} beginning state
     *    _interpolated to this point in time.
     */
    TweenTransition.prototype.get = function get(timestamp) {
        this.update(timestamp);
        return this.state;
    };

    function _calculateVelocity(current, start, curve, duration, t) {
        var velocity;
        var eps = 1e-7;
        var speed = (curve(t) - curve(t - eps)) / eps;
        if (current instanceof Array) {
            velocity = [];
            for (var i = 0; i < current.length; i++){
                if (typeof current[i] === 'number')
                    velocity[i] = speed * (current[i] - start[i]) / duration;
                else
                    velocity[i] = 0;
            }

        }
        else velocity = speed * (current - start) / duration;
        return velocity;
    }

    function _calculateState(start, end, t) {
        var state;
        if (start instanceof Array) {
            state = [];
            for (var i = 0; i < start.length; i++) {
                if (typeof start[i] === 'number')
                    state[i] = _interpolate(start[i], end[i], t);
                else
                    state[i] = start[i];
            }
        }
        else state = _interpolate(start, end, t);
        return state;
    }

    /**
     * Update internal state to the provided timestamp. This may invoke the last
     *    callback and begin a new action.
     *
     * @method update
     *
     *
     * @param {number=} timestamp Evaluate the curve at a normalized version of this
     *    time. If omitted, use current time. (Unix epoch time)
     */
    TweenTransition.prototype.update = function update(timestamp) {
        if (!this._active) {
            if (this._callback) {
                var callback = this._callback;
                this._callback = undefined;
                callback();
            }
            return;
        }

        if (!timestamp) timestamp = Date.now();
        if (this._updateTime >= timestamp) return;
        this._updateTime = timestamp;

        var timeSinceStart = timestamp - this._startTime;
        if (timeSinceStart >= this._duration) {
            this.state = this._endValue;
            this.velocity = _calculateVelocity(this.state, this._startValue, this._curve, this._duration, 1);
            this._active = false;
        }
        else if (timeSinceStart < 0) {
            this.state = this._startValue;
            this.velocity = this._startVelocity;
        }
        else {
            var t = timeSinceStart / this._duration;
            this.state = _calculateState(this._startValue, this._endValue, this._curve(t));
            this.velocity = _calculateVelocity(this.state, this._startValue, this._curve, this._duration, t);
        }
    };

    /**
     * Is there at least one action pending completion?
     *
     * @method isActive
     *
     *
     * @return {boolean}
     */
    TweenTransition.prototype.isActive = function isActive() {
        return this._active;
    };

    /**
     * Halt transition at current state and erase all pending actions.
     *
     * @method halt
     *
     */
    TweenTransition.prototype.halt = function halt() {
        this.reset(this.get());
    };

    // Register all the default curves
    TweenTransition.registerCurve('linear', TweenTransition.Curves.linear);
    TweenTransition.registerCurve('easeIn', TweenTransition.Curves.easeIn);
    TweenTransition.registerCurve('easeOut', TweenTransition.Curves.easeOut);
    TweenTransition.registerCurve('easeInOut', TweenTransition.Curves.easeInOut);
    TweenTransition.registerCurve('easeOutBounce', TweenTransition.Curves.easeOutBounce);
    TweenTransition.registerCurve('spring', TweenTransition.Curves.spring);

    TweenTransition.customCurve = function customCurve(v1, v2) {
        v1 = v1 || 0; v2 = v2 || 0;
        return function(t) {
            return v1*t + (-2*v1 - v2 + 3)*t*t + (v1 + v2 - 2)*t*t*t;
        };
    };

    module.exports = TweenTransition;
});

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: david@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define('famous/transitions/Transitionable',['require','exports','module','./MultipleTransition','./TweenTransition'],function(require, exports, module) {
    var MultipleTransition = require('./MultipleTransition');
    var TweenTransition = require('./TweenTransition');

    /**
     * A state maintainer for a smooth transition between
     *    numerically-specified states. Example numeric states include floats or
     *    Transform objects.
     *
     * An initial state is set with the constructor or set(startState). A
     *    corresponding end state and transition are set with set(endState,
     *    transition). Subsequent calls to set(endState, transition) begin at
     *    the last state. Calls to get(timestamp) provide the interpolated state
     *    along the way.
     *
     * Note that there is no event loop here - calls to get() are the only way
     *    to find state projected to the current (or provided) time and are
     *    the only way to trigger callbacks. Usually this kind of object would
     *    be part of the render() path of a visible component.
     *
     * @class Transitionable
     * @constructor
     * @param {number|Array.Number|Object.<number|string, number>} start
     *    beginning state
     */
    function Transitionable(start) {
        this.currentAction = null;
        this.actionQueue = [];
        this.callbackQueue = [];

        this.state = 0;
        this.velocity = undefined;
        this._callback = undefined;
        this._engineInstance = null;
        this._currentMethod = null;

        this.set(start);
    }

    var transitionMethods = {};

    Transitionable.register = function register(methods) {
        var success = true;
        for (var method in methods) {
            if (!Transitionable.registerMethod(method, methods[method]))
                success = false;
        }
        return success;
    };

    Transitionable.registerMethod = function registerMethod(name, engineClass) {
        if (!(name in transitionMethods)) {
            transitionMethods[name] = engineClass;
            return true;
        }
        else return false;
    };

    Transitionable.unregisterMethod = function unregisterMethod(name) {
        if (name in transitionMethods) {
            delete transitionMethods[name];
            return true;
        }
        else return false;
    };

    function _loadNext() {
        if (this._callback) {
            var callback = this._callback;
            this._callback = undefined;
            callback();
        }
        if (this.actionQueue.length <= 0) {
            this.set(this.get()); // no update required
            return;
        }
        this.currentAction = this.actionQueue.shift();
        this._callback = this.callbackQueue.shift();

        var method = null;
        var endValue = this.currentAction[0];
        var transition = this.currentAction[1];
        if (transition instanceof Object && transition.method) {
            method = transition.method;
            if (typeof method === 'string') method = transitionMethods[method];
        }
        else {
            method = TweenTransition;
        }

        if (this._currentMethod !== method) {
            if (!(endValue instanceof Object) || method.SUPPORTS_MULTIPLE === true || endValue.length <= method.SUPPORTS_MULTIPLE) {
                this._engineInstance = new method();
            }
            else {
                this._engineInstance = new MultipleTransition(method);
            }
            this._currentMethod = method;
        }

        this._engineInstance.reset(this.state, this.velocity);
        if (this.velocity !== undefined) transition.velocity = this.velocity;
        this._engineInstance.set(endValue, transition, _loadNext.bind(this));
    }

    /**
     * Add transition to end state to the queue of pending transitions. Special
     *    Use: calling without a transition resets the object to that state with
     *    no pending actions
     *
     * @method set
     *
     * @param {number|FamousMatrix|Array.Number|Object.<number, number>} endState
     *    end state to which we interpolate
     * @param {transition=} transition object of type {duration: number, curve:
     *    f[0,1] -> [0,1] or name}. If transition is omitted, change will be
     *    instantaneous.
     * @param {function()=} callback Zero-argument function to call on observed
     *    completion (t=1)
     */
    Transitionable.prototype.set = function set(endState, transition, callback) {
        if (!transition) {
            this.reset(endState);
            if (callback) callback();
            return this;
        }

        var action = [endState, transition];
        this.actionQueue.push(action);
        this.callbackQueue.push(callback);
        if (!this.currentAction) _loadNext.call(this);
        return this;
    };

    /**
     * Cancel all transitions and reset to a stable state
     *
     * @method reset
     *
     * @param {number|Array.Number|Object.<number, number>} startState
     *    stable state to set to
     */
    Transitionable.prototype.reset = function reset(startState, startVelocity) {
        this._currentMethod = null;
        this._engineInstance = null;
        this._callback = undefined;
        this.state = startState;
        this.velocity = startVelocity;
        this.currentAction = null;
        this.actionQueue = [];
        this.callbackQueue = [];
    };

    /**
     * Add delay action to the pending action queue queue.
     *
     * @method delay
     *
     * @param {number} duration delay time (ms)
     * @param {function} callback Zero-argument function to call on observed
     *    completion (t=1)
     */
    Transitionable.prototype.delay = function delay(duration, callback) {
        this.set(this.get(), {duration: duration,
            curve: function() {
                return 0;
            }},
            callback
        );
    };

    /**
     * Get interpolated state of current action at provided time. If the last
     *    action has completed, invoke its callback.
     *
     * @method get
     *
     * @param {number=} timestamp Evaluate the curve at a normalized version of this
     *    time. If omitted, use current time. (Unix epoch time)
     * @return {number|Object.<number|string, number>} beginning state
     *    interpolated to this point in time.
     */
    Transitionable.prototype.get = function get(timestamp) {
        if (this._engineInstance) {
            if (this._engineInstance.getVelocity)
                this.velocity = this._engineInstance.getVelocity();
            this.state = this._engineInstance.get(timestamp);
        }
        return this.state;
    };

    /**
     * Is there at least one action pending completion?
     *
     * @method isActive
     *
     * @return {boolean}
     */
    Transitionable.prototype.isActive = function isActive() {
        return !!this.currentAction;
    };

    /**
     * Halt transition at current state and erase all pending actions.
     *
     * @method halt
     */
    Transitionable.prototype.halt = function halt() {
        return this.set(this.get());
    };

    module.exports = Transitionable;
});

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: mark@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define('famous/core/Context',['require','exports','module','./RenderNode','./EventHandler','./ElementAllocator','./Transform','../transitions/Transitionable'],function(require, exports, module) {
    var RenderNode = require('./RenderNode');
    var EventHandler = require('./EventHandler');
    var ElementAllocator = require('./ElementAllocator');
    var Transform = require('./Transform');
    var Transitionable = require('../transitions/Transitionable');

    var _zeroZero = [0, 0];
    var usePrefix = !('perspective' in document.documentElement.style);

    function _getElementSize(element) {
        return [element.clientWidth, element.clientHeight];
    }

    var _setPerspective = usePrefix ? function(element, perspective) {
        element.style.webkitPerspective = perspective ? perspective.toFixed() + 'px' : '';
    } : function(element, perspective) {
        element.style.perspective = perspective ? perspective.toFixed() + 'px' : '';
    };

    /**
     * The top-level container for a Famous-renderable piece of the document.
     *   It is directly updated by the process-wide Engine object, and manages one
     *   render tree root, which can contain other renderables.
     *
     * @class Context
     * @constructor
     * @private
     * @param {Node} container Element in which content will be inserted
     */
    function Context(container) {
        this.container = container;
        this._allocator = new ElementAllocator(container);

        this._node = new RenderNode();
        this._eventOutput = new EventHandler();
        this._size = _getElementSize(this.container);

        this._perspectiveState = new Transitionable(0);
        this._perspective = undefined;

        this._nodeContext = {
            allocator: this._allocator,
            transform: Transform.identity,
            opacity: 1,
            origin: _zeroZero,
            align: _zeroZero,
            size: this._size
        };

        this._eventOutput.on('resize', function() {
            this.setSize(_getElementSize(this.container));
        }.bind(this));

    }

    // Note: Unused
    Context.prototype.getAllocator = function getAllocator() {
        return this._allocator;
    };

    /**
     * Add renderables to this Context's render tree.
     *
     * @method add
     *
     * @param {Object} obj renderable object
     * @return {RenderNode} RenderNode wrapping this object, if not already a RenderNode
     */
    Context.prototype.add = function add(obj) {
        return this._node.add(obj);
    };

    /**
     * Move this Context to another containing document element.
     *
     * @method migrate
     *
     * @param {Node} container Element to which content will be migrated
     */
    Context.prototype.migrate = function migrate(container) {
        if (container === this.container) return;
        this.container = container;
        this._allocator.migrate(container);
    };

    /**
     * Gets viewport size for Context.
     *
     * @method getSize
     *
     * @return {Array.Number} viewport size as [width, height]
     */
    Context.prototype.getSize = function getSize() {
        return this._size;
    };

    /**
     * Sets viewport size for Context.
     *
     * @method setSize
     *
     * @param {Array.Number} size [width, height].  If unspecified, use size of root document element.
     */
    Context.prototype.setSize = function setSize(size) {
        if (!size) size = _getElementSize(this.container);
        this._size[0] = size[0];
        this._size[1] = size[1];
    };

    /**
     * Commit this Context's content changes to the document.
     *
     * @private
     * @method update
     * @param {Object} contextParameters engine commit specification
     */
    Context.prototype.update = function update(contextParameters) {
        if (contextParameters) {
            if (contextParameters.transform) this._nodeContext.transform = contextParameters.transform;
            if (contextParameters.opacity) this._nodeContext.opacity = contextParameters.opacity;
            if (contextParameters.origin) this._nodeContext.origin = contextParameters.origin;
            if (contextParameters.align) this._nodeContext.align = contextParameters.align;
            if (contextParameters.size) this._nodeContext.size = contextParameters.size;
        }
        var perspective = this._perspectiveState.get();
        if (perspective !== this._perspective) {
            _setPerspective(this.container, perspective);
            this._perspective = perspective;
        }

        this._node.commit(this._nodeContext);
    };

    /**
     * Get current perspective of this context in pixels.
     *
     * @method getPerspective
     * @return {Number} depth perspective in pixels
     */
    Context.prototype.getPerspective = function getPerspective() {
        return this._perspectiveState.get();
    };

    /**
     * Set current perspective of this context in pixels.
     *
     * @method setPerspective
     * @param {Number} perspective in pixels
     * @param {Object} [transition] Transitionable object for applying the change
     * @param {function(Object)} callback function called on completion of transition
     */
    Context.prototype.setPerspective = function setPerspective(perspective, transition, callback) {
        return this._perspectiveState.set(perspective, transition, callback);
    };

    /**
     * Trigger an event, sending to all downstream handlers
     *   listening for provided 'type' key.
     *
     * @method emit
     *
     * @param {string} type event type key (for example, 'click')
     * @param {Object} event event data
     * @return {EventHandler} this
     */
    Context.prototype.emit = function emit(type, event) {
        return this._eventOutput.emit(type, event);
    };

    /**
     * Bind a callback function to an event type handled by this object.
     *
     * @method "on"
     *
     * @param {string} type event type key (for example, 'click')
     * @param {function(string, Object)} handler callback
     * @return {EventHandler} this
     */
    Context.prototype.on = function on(type, handler) {
        return this._eventOutput.on(type, handler);
    };

    /**
     * Unbind an event by type and handler.
     *   This undoes the work of "on".
     *
     * @method removeListener
     *
     * @param {string} type event type key (for example, 'click')
     * @param {function} handler function object to remove
     * @return {EventHandler} internal event handler object (for chaining)
     */
    Context.prototype.removeListener = function removeListener(type, handler) {
        return this._eventOutput.removeListener(type, handler);
    };

    /**
     * Add event handler object to set of downstream handlers.
     *
     * @method pipe
     *
     * @param {EventHandler} target event handler target object
     * @return {EventHandler} passed event handler
     */
    Context.prototype.pipe = function pipe(target) {
        return this._eventOutput.pipe(target);
    };

    /**
     * Remove handler object from set of downstream handlers.
     *   Undoes work of "pipe".
     *
     * @method unpipe
     *
     * @param {EventHandler} target target handler object
     * @return {EventHandler} provided target
     */
    Context.prototype.unpipe = function unpipe(target) {
        return this._eventOutput.unpipe(target);
    };

    module.exports = Context;
});

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: mark@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define('famous/core/OptionsManager',['require','exports','module','./EventHandler'],function(require, exports, module) {
    var EventHandler = require('./EventHandler');

    /**
     *  A collection of methods for setting options which can be extended
     *  onto other classes.
     *
     *
     *  **** WARNING ****
     *  You can only pass through objects that will compile into valid JSON.
     *
     *  Valid options:
     *      Strings,
     *      Arrays,
     *      Objects,
     *      Numbers,
     *      Nested Objects,
     *      Nested Arrays.
     *
     *    This excludes:
     *        Document Fragments,
     *        Functions
     * @class OptionsManager
     * @constructor
     * @param {Object} value options dictionary
     */
    function OptionsManager(value) {
        this._value = value;
        this.eventOutput = null;
    }

    /**
     * Create options manager from source dictionary with arguments overriden by patch dictionary.
     *
     * @static
     * @method OptionsManager.patch
     *
     * @param {Object} source source arguments
     * @param {...Object} data argument additions and overwrites
     * @return {Object} source object
     */
    OptionsManager.patch = function patchObject(source, data) {
        var manager = new OptionsManager(source);
        for (var i = 1; i < arguments.length; i++) manager.patch(arguments[i]);
        return source;
    };

    function _createEventOutput() {
        this.eventOutput = new EventHandler();
        this.eventOutput.bindThis(this);
        EventHandler.setOutputHandler(this, this.eventOutput);
    }

    /**
     * Create OptionsManager from source with arguments overriden by patches.
     *   Triggers 'change' event on this object's event handler if the state of
     *   the OptionsManager changes as a result.
     *
     * @method patch
     *
     * @param {...Object} arguments list of patch objects
     * @return {OptionsManager} this
     */
    OptionsManager.prototype.patch = function patch() {
        var myState = this._value;
        for (var i = 0; i < arguments.length; i++) {
            var data = arguments[i];
            for (var k in data) {
                if ((k in myState) && (data[k] && data[k].constructor === Object) && (myState[k] && myState[k].constructor === Object)) {
                    if (!myState.hasOwnProperty(k)) myState[k] = Object.create(myState[k]);
                    this.key(k).patch(data[k]);
                    if (this.eventOutput) this.eventOutput.emit('change', {id: k, value: this.key(k).value()});
                }
                else this.set(k, data[k]);
            }
        }
        return this;
    };

    /**
     * Alias for patch
     *
     * @method setOptions
     *
     */
    OptionsManager.prototype.setOptions = OptionsManager.prototype.patch;

    /**
     * Return OptionsManager based on sub-object retrieved by key
     *
     * @method key
     *
     * @param {string} identifier key
     * @return {OptionsManager} new options manager with the value
     */
    OptionsManager.prototype.key = function key(identifier) {
        var result = new OptionsManager(this._value[identifier]);
        if (!(result._value instanceof Object) || result._value instanceof Array) result._value = {};
        return result;
    };

    /**
     * Look up value by key or get the full options hash
     * @method get
     *
     * @param {string} key key
     * @return {Object} associated object or full options hash
     */
    OptionsManager.prototype.get = function get(key) {
        return key ? this._value[key] : this._value;
    };

    /**
     * Alias for get
     * @method getOptions
     */
    OptionsManager.prototype.getOptions = OptionsManager.prototype.get;

    /**
     * Set key to value.  Outputs 'change' event if a value is overwritten.
     *
     * @method set
     *
     * @param {string} key key string
     * @param {Object} value value object
     * @return {OptionsManager} new options manager based on the value object
     */
    OptionsManager.prototype.set = function set(key, value) {
        var originalValue = this.get(key);
        this._value[key] = value;
        if (this.eventOutput && value !== originalValue) this.eventOutput.emit('change', {id: key, value: value});
        return this;
    };

    /**
     * Bind a callback function to an event type handled by this object.
     *
     * @method "on"
     *
     * @param {string} type event type key (for example, 'change')
     * @param {function(string, Object)} handler callback
     * @return {EventHandler} this
     */
    OptionsManager.prototype.on = function on() {
        _createEventOutput.call(this);
        return this.on.apply(this, arguments);
    };

    /**
     * Unbind an event by type and handler.
     *   This undoes the work of "on".
     *
     * @method removeListener
     *
     * @param {string} type event type key (for example, 'change')
     * @param {function} handler function object to remove
     * @return {EventHandler} internal event handler object (for chaining)
     */
    OptionsManager.prototype.removeListener = function removeListener() {
        _createEventOutput.call(this);
        return this.removeListener.apply(this, arguments);
    };

    /**
     * Add event handler object to set of downstream handlers.
     *
     * @method pipe
     *
     * @param {EventHandler} target event handler target object
     * @return {EventHandler} passed event handler
     */
    OptionsManager.prototype.pipe = function pipe() {
        _createEventOutput.call(this);
        return this.pipe.apply(this, arguments);
    };

    /**
     * Remove handler object from set of downstream handlers.
     * Undoes work of "pipe"
     *
     * @method unpipe
     *
     * @param {EventHandler} target target handler object
     * @return {EventHandler} provided target
     */
    OptionsManager.prototype.unpipe = function unpipe() {
        _createEventOutput.call(this);
        return this.unpipe.apply(this, arguments);
    };

    module.exports = OptionsManager;
});

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: mark@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define('famous/core/Engine',['require','exports','module','./Context','./EventHandler','./OptionsManager'],function(require, exports, module) {

    /**
     * The singleton object initiated upon process
     *   startup which manages all active Context instances, runs
     *   the render dispatch loop, and acts as a listener and dispatcher
     *   for events.  All methods are therefore static.
     *
     *   On static initialization, window.requestAnimationFrame is called with
     *     the event loop function.
     *
     *   Note: Any window in which Engine runs will prevent default
     *     scrolling behavior on the 'touchmove' event.
     *
     * @static
     * @class Engine
     */
    var Context = require('./Context');
    var EventHandler = require('./EventHandler');
    var OptionsManager = require('./OptionsManager');

    var Engine = {};

    var contexts = [];

    var nextTickQueue = [];

    var currentFrame = 0;
    var nextTickFrame = 0;

    var deferQueue = [];

    var lastTime = Date.now();
    var frameTime;
    var frameTimeLimit;
    var loopEnabled = true;
    var eventForwarders = {};
    var eventHandler = new EventHandler();

    var options = {
        containerType: 'div',
        containerClass: 'famous-container',
        fpsCap: undefined,
        runLoop: true,
        appMode: true
    };
    var optionsManager = new OptionsManager(options);

    /** @const */
    var MAX_DEFER_FRAME_TIME = 10;

    /**
     * Inside requestAnimationFrame loop, step() is called, which:
     *   calculates current FPS (throttling loop if it is over limit set in setFPSCap),
     *   emits dataless 'prerender' event on start of loop,
     *   calls in order any one-shot functions registered by nextTick on last loop,
     *   calls Context.update on all Context objects registered,
     *   and emits dataless 'postrender' event on end of loop.
     *
     * @static
     * @private
     * @method step
     */
    Engine.step = function step() {
        currentFrame++;
        nextTickFrame = currentFrame;

        var currentTime = Date.now();

        // skip frame if we're over our framerate cap
        if (frameTimeLimit && currentTime - lastTime < frameTimeLimit) return;

        var i = 0;

        frameTime = currentTime - lastTime;
        lastTime = currentTime;

        eventHandler.emit('prerender');

        // empty the queue
        var numFunctions = nextTickQueue.length;
        while (numFunctions--) (nextTickQueue.shift())(currentFrame);

        // limit total execution time for deferrable functions
        while (deferQueue.length && (Date.now() - currentTime) < MAX_DEFER_FRAME_TIME) {
            deferQueue.shift().call(this);
        }

        for (i = 0; i < contexts.length; i++) contexts[i].update();

        eventHandler.emit('postrender');
    };

    // engage requestAnimationFrame
    function loop() {
        if (options.runLoop) {
            Engine.step();
            window.requestAnimationFrame(loop);
        }
        else loopEnabled = false;
    }
    window.requestAnimationFrame(loop);

    //
    // Upon main document window resize (unless on an "input" HTML element):
    //   scroll to the top left corner of the window,
    //   and for each managed Context: emit the 'resize' event and update its size.
    // @param {Object=} event document event
    //
    function handleResize(event) {
        for (var i = 0; i < contexts.length; i++) {
            contexts[i].emit('resize');
        }
        eventHandler.emit('resize');
    }
    window.addEventListener('resize', handleResize, false);
    handleResize();

    /**
     * Initialize famous for app mode
     *
     * @static
     * @private
     * @method initialize
     */
    function initialize() {
        // prevent scrolling via browser
        window.addEventListener('touchmove', function(event) {
            event.preventDefault();
        }, true);

        addRootClasses();
    }
    var initialized = false;

    function addRootClasses() {
        if (!document.body) {
            Engine.nextTick(addRootClasses);
            return;
        }

        document.body.classList.add('famous-root');
        document.documentElement.classList.add('famous-root');
    }

    /**
     * Add event handler object to set of downstream handlers.
     *
     * @method pipe
     *
     * @param {EventHandler} target event handler target object
     * @return {EventHandler} passed event handler
     */
    Engine.pipe = function pipe(target) {
        if (target.subscribe instanceof Function) return target.subscribe(Engine);
        else return eventHandler.pipe(target);
    };

    /**
     * Remove handler object from set of downstream handlers.
     *   Undoes work of "pipe".
     *
     * @method unpipe
     *
     * @param {EventHandler} target target handler object
     * @return {EventHandler} provided target
     */
    Engine.unpipe = function unpipe(target) {
        if (target.unsubscribe instanceof Function) return target.unsubscribe(Engine);
        else return eventHandler.unpipe(target);
    };

    /**
     * Bind a callback function to an event type handled by this object.
     *
     * @static
     * @method "on"
     *
     * @param {string} type event type key (for example, 'click')
     * @param {function(string, Object)} handler callback
     * @return {EventHandler} this
     */
    Engine.on = function on(type, handler) {
        if (!(type in eventForwarders)) {
            eventForwarders[type] = eventHandler.emit.bind(eventHandler, type);

            addEngineListener(type, eventForwarders[type]);
        }
        return eventHandler.on(type, handler);
    };

    function addEngineListener(type, forwarder) {
        if (!document.body) {
            Engine.nextTick(addEventListener.bind(this, type, forwarder));
            return;
        }

        document.body.addEventListener(type, forwarder);
    }

    /**
     * Trigger an event, sending to all downstream handlers
     *   listening for provided 'type' key.
     *
     * @method emit
     *
     * @param {string} type event type key (for example, 'click')
     * @param {Object} event event data
     * @return {EventHandler} this
     */
    Engine.emit = function emit(type, event) {
        return eventHandler.emit(type, event);
    };

    /**
     * Unbind an event by type and handler.
     *   This undoes the work of "on".
     *
     * @static
     * @method removeListener
     *
     * @param {string} type event type key (for example, 'click')
     * @param {function} handler function object to remove
     * @return {EventHandler} internal event handler object (for chaining)
     */
    Engine.removeListener = function removeListener(type, handler) {
        return eventHandler.removeListener(type, handler);
    };

    /**
     * Return the current calculated frames per second of the Engine.
     *
     * @static
     * @method getFPS
     *
     * @return {Number} calculated fps
     */
    Engine.getFPS = function getFPS() {
        return 1000 / frameTime;
    };

    /**
     * Set the maximum fps at which the system should run. If internal render
     *    loop is called at a greater frequency than this FPSCap, Engine will
     *    throttle render and update until this rate is achieved.
     *
     * @static
     * @method setFPSCap
     *
     * @param {Number} fps maximum frames per second
     */
    Engine.setFPSCap = function setFPSCap(fps) {
        frameTimeLimit = Math.floor(1000 / fps);
    };

    /**
     * Return engine options.
     *
     * @static
     * @method getOptions
     * @param {string} key
     * @return {Object} engine options
     */
    Engine.getOptions = function getOptions(key) {
        return optionsManager.getOptions(key);
    };

    /**
     * Set engine options
     *
     * @static
     * @method setOptions
     *
     * @param {Object} [options] overrides of default options
     * @param {Number} [options.fpsCap]  maximum fps at which the system should run
     * @param {boolean} [options.runLoop=true] whether the run loop should continue
     * @param {string} [options.containerType="div"] type of container element.  Defaults to 'div'.
     * @param {string} [options.containerClass="famous-container"] type of container element.  Defaults to 'famous-container'.
     */
    Engine.setOptions = function setOptions(options) {
        return optionsManager.setOptions.apply(optionsManager, arguments);
    };

    /**
     * Creates a new Context for rendering and event handling with
     *    provided document element as top of each tree. This will be tracked by the
     *    process-wide Engine.
     *
     * @static
     * @method createContext
     *
     * @param {Node} el will be top of Famo.us document element tree
     * @return {Context} new Context within el
     */
    Engine.createContext = function createContext(el) {
        if (!initialized && options.appMode) Engine.nextTick(initialize);

        var needMountContainer = false;
        if (!el) {
            el = document.createElement(options.containerType);
            el.classList.add(options.containerClass);
            needMountContainer = true;
        }

        var context = new Context(el);
        Engine.registerContext(context);

        if (needMountContainer) mount(context, el);

        return context;
    };

    function mount(context, el) {
        if (!document.body) {
            Engine.nextTick(mount.bind(this, context, el));
            return;
        }

        document.body.appendChild(el);
        context.emit('resize');
    }

    /**
     * Registers an existing context to be updated within the run loop.
     *
     * @static
     * @method registerContext
     *
     * @param {Context} context Context to register
     * @return {FamousContext} provided context
     */
    Engine.registerContext = function registerContext(context) {
        contexts.push(context);
        return context;
    };

    /**
     * Returns a list of all contexts.
     *
     * @static
     * @method getContexts
     * @return {Array} contexts that are updated on each tick
     */
    Engine.getContexts = function getContexts() {
        return contexts;
    };

    /**
     * Removes a context from the run loop. Note: this does not do any
     *     cleanup.
     *
     * @static
     * @method deregisterContext
     *
     * @param {Context} context Context to deregister
     */
    Engine.deregisterContext = function deregisterContext(context) {
        var i = contexts.indexOf(context);
        if (i >= 0) contexts.splice(i, 1);
    };

    /**
     * Queue a function to be executed on the next tick of the
     *    Engine.
     *
     * @static
     * @method nextTick
     *
     * @param {function(Object)} fn function accepting window object
     */
    Engine.nextTick = function nextTick(fn) {
        nextTickQueue.push(fn);
    };

    /**
     * Queue a function to be executed sometime soon, at a time that is
     *    unlikely to affect frame rate.
     *
     * @static
     * @method defer
     *
     * @param {Function} fn
     */
    Engine.defer = function defer(fn) {
        deferQueue.push(fn);
    };

    optionsManager.on('change', function(data) {
        if (data.id === 'fpsCap') Engine.setFPSCap(data.value);
        else if (data.id === 'runLoop') {
            // kick off the loop only if it was stopped
            if (!loopEnabled && data.value) {
                loopEnabled = true;
                window.requestAnimationFrame(loop);
            }
        }
    });

    module.exports = Engine;
});

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: mark@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define('famous/core/ElementOutput',['require','exports','module','./Entity','./EventHandler','./Transform'],function(require, exports, module) {
    var Entity = require('./Entity');
    var EventHandler = require('./EventHandler');
    var Transform = require('./Transform');

    var usePrefix = !('transform' in document.documentElement.style);
    var devicePixelRatio = window.devicePixelRatio || 1;

    /**
     * A base class for viewable content and event
     *   targets inside a Famo.us application, containing a renderable document
     *   fragment. Like an HTML div, it can accept internal markup,
     *   properties, classes, and handle events.
     *
     * @class ElementOutput
     * @constructor
     *
     * @param {Node} element document parent of this container
     */
    function ElementOutput(element) {
        this._matrix = null;
        this._opacity = 1;
        this._origin = null;
        this._size = null;

        this._eventOutput = new EventHandler();
        this._eventOutput.bindThis(this);

        /** @ignore */
        this.eventForwarder = function eventForwarder(event) {
            this._eventOutput.emit(event.type, event);
        }.bind(this);

        this.id = Entity.register(this);
        this._element = null;
        this._sizeDirty = false;
        this._originDirty = false;
        this._transformDirty = false;

        this._invisible = false;
        if (element) this.attach(element);
    }

    /**
     * Bind a callback function to an event type handled by this object.
     *
     * @method "on"
     *
     * @param {string} type event type key (for example, 'click')
     * @param {function(string, Object)} fn handler callback
     * @return {EventHandler} this
     */
    ElementOutput.prototype.on = function on(type, fn) {
        if (this._element) this._element.addEventListener(type, this.eventForwarder);
        this._eventOutput.on(type, fn);
    };

    /**
     * Unbind an event by type and handler.
     *   This undoes the work of "on"
     *
     * @method removeListener
     * @param {string} type event type key (for example, 'click')
     * @param {function(string, Object)} fn handler
     */
    ElementOutput.prototype.removeListener = function removeListener(type, fn) {
        this._eventOutput.removeListener(type, fn);
    };

    /**
     * Trigger an event, sending to all downstream handlers
     *   listening for provided 'type' key.
     *
     * @method emit
     *
     * @param {string} type event type key (for example, 'click')
     * @param {Object} [event] event data
     * @return {EventHandler} this
     */
    ElementOutput.prototype.emit = function emit(type, event) {
        if (event && !event.origin) event.origin = this;
        var handled = this._eventOutput.emit(type, event);
        if (handled && event && event.stopPropagation) event.stopPropagation();
        return handled;
    };

    /**
     * Add event handler object to set of downstream handlers.
     *
     * @method pipe
     *
     * @param {EventHandler} target event handler target object
     * @return {EventHandler} passed event handler
     */
    ElementOutput.prototype.pipe = function pipe(target) {
        return this._eventOutput.pipe(target);
    };

    /**
     * Remove handler object from set of downstream handlers.
     *   Undoes work of "pipe"
     *
     * @method unpipe
     *
     * @param {EventHandler} target target handler object
     * @return {EventHandler} provided target
     */
    ElementOutput.prototype.unpipe = function unpipe(target) {
        return this._eventOutput.unpipe(target);
    };

    /**
     * Return spec for this surface. Note that for a base surface, this is
     *    simply an id.
     *
     * @method render
     * @private
     * @return {Object} render spec for this surface (spec id)
     */
    ElementOutput.prototype.render = function render() {
        return this.id;
    };

    //  Attach Famous event handling to document events emanating from target
    //    document element.  This occurs just after attachment to the document.
    //    Calling this enables methods like #on and #pipe.
    function _addEventListeners(target) {
        for (var i in this._eventOutput.listeners) {
            target.addEventListener(i, this.eventForwarder);
        }
    }

    //  Detach Famous event handling from document events emanating from target
    //  document element.  This occurs just before detach from the document.
    function _removeEventListeners(target) {
        for (var i in this._eventOutput.listeners) {
            target.removeEventListener(i, this.eventForwarder);
        }
    }

    /**
     * Return a Matrix's webkit css representation to be used with the
     *    CSS3 -webkit-transform style.
     *    Example: -webkit-transform: matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,716,243,0,1)
     *
     * @method _formatCSSTransform
     * @private
     * @param {FamousMatrix} m matrix
     * @return {string} matrix3d CSS style representation of the transform
     */
    function _formatCSSTransform(m) {
        m[12] = Math.round(m[12] * devicePixelRatio) / devicePixelRatio;
        m[13] = Math.round(m[13] * devicePixelRatio) / devicePixelRatio;

        var result = 'matrix3d(';
        for (var i = 0; i < 15; i++) {
            result += (m[i] < 0.000001 && m[i] > -0.000001) ? '0,' : m[i] + ',';
        }
        result += m[15] + ')';
        return result;
    }

    /**
     * Directly apply given FamousMatrix to the document element as the
     *   appropriate webkit CSS style.
     *
     * @method setMatrix
     *
     * @static
     * @private
     * @param {Element} element document element
     * @param {FamousMatrix} matrix
     */

    var _setMatrix;
    if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
        _setMatrix = function(element, matrix) {
            element.style.zIndex = (matrix[14] * 1000000) | 0;    // fix for Firefox z-buffer issues
            element.style.transform = _formatCSSTransform(matrix);
        };
    }
    else if (usePrefix) {
        _setMatrix = function(element, matrix) {
            element.style.webkitTransform = _formatCSSTransform(matrix);
        };
    }
    else {
        _setMatrix = function(element, matrix) {
            element.style.transform = _formatCSSTransform(matrix);
        };
    }

    // format origin as CSS percentage string
    function _formatCSSOrigin(origin) {
        return (100 * origin[0]) + '% ' + (100 * origin[1]) + '%';
    }

    // Directly apply given origin coordinates to the document element as the
    // appropriate webkit CSS style.
    var _setOrigin = usePrefix ? function(element, origin) {
        element.style.webkitTransformOrigin = _formatCSSOrigin(origin);
    } : function(element, origin) {
        element.style.transformOrigin = _formatCSSOrigin(origin);
    };

    // Shrink given document element until it is effectively invisible.
    var _setInvisible = usePrefix ? function(element) {
        element.style.webkitTransform = 'scale3d(0.0001,0.0001,0.0001)';
        element.style.opacity = 0;
    } : function(element) {
        element.style.transform = 'scale3d(0.0001,0.0001,0.0001)';
        element.style.opacity = 0;
    };

    function _xyNotEquals(a, b) {
        return (a && b) ? (a[0] !== b[0] || a[1] !== b[1]) : a !== b;
    }

    /**
     * Apply changes from this component to the corresponding document element.
     * This includes changes to classes, styles, size, content, opacity, origin,
     * and matrix transforms.
     *
     * @private
     * @method commit
     * @param {Context} context commit context
     */
    ElementOutput.prototype.commit = function commit(context) {
        var target = this._element;
        if (!target) return;

        var matrix = context.transform;
        var opacity = context.opacity;
        var origin = context.origin;
        var size = context.size;

        if (!matrix && this._matrix) {
            this._matrix = null;
            this._opacity = 0;
            _setInvisible(target);
            return;
        }

        if (_xyNotEquals(this._origin, origin)) this._originDirty = true;
        if (Transform.notEquals(this._matrix, matrix)) this._transformDirty = true;

        if (this._invisible) {
            this._invisible = false;
            this._element.style.display = '';
        }

        if (this._opacity !== opacity) {
            this._opacity = opacity;
            target.style.opacity = (opacity >= 1) ? '0.999999' : opacity;
        }

        if (this._transformDirty || this._originDirty || this._sizeDirty) {
            if (this._sizeDirty) this._sizeDirty = false;

            if (this._originDirty) {
                if (origin) {
                    if (!this._origin) this._origin = [0, 0];
                    this._origin[0] = origin[0];
                    this._origin[1] = origin[1];
                }
                else this._origin = null;
                _setOrigin(target, this._origin);
                this._originDirty = false;
            }

            if (!matrix) matrix = Transform.identity;
            this._matrix = matrix;
            var aaMatrix = this._size ? Transform.thenMove(matrix, [-this._size[0]*origin[0], -this._size[1]*origin[1], 0]) : matrix;
            _setMatrix(target, aaMatrix);
            this._transformDirty = false;
        }
    };

    ElementOutput.prototype.cleanup = function cleanup() {
        if (this._element) {
            this._invisible = true;
            this._element.style.display = 'none';
        }
    };

    /**
     * Place the document element that this component manages into the document.
     *
     * @private
     * @method attach
     * @param {Node} target document parent of this container
     */
    ElementOutput.prototype.attach = function attach(target) {
        this._element = target;
        _addEventListeners.call(this, target);
    };

    /**
     * Remove any contained document content associated with this surface
     *   from the actual document.
     *
     * @private
     * @method detach
     */
    ElementOutput.prototype.detach = function detach() {
        var target = this._element;
        if (target) {
            _removeEventListeners.call(this, target);
            if (this._invisible) {
                this._invisible = false;
                this._element.style.display = '';
            }
        }
        this._element = null;
        return target;
    };

    module.exports = ElementOutput;
});

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: mark@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define('famous/core/Surface',['require','exports','module','./ElementOutput'],function(require, exports, module) {
    var ElementOutput = require('./ElementOutput');

    /**
     * A base class for viewable content and event
     *   targets inside a Famo.us application, containing a renderable document
     *   fragment. Like an HTML div, it can accept internal markup,
     *   properties, classes, and handle events.
     *
     * @class Surface
     * @constructor
     *
     * @param {Object} [options] default option overrides
     * @param {Array.Number} [options.size] [width, height] in pixels
     * @param {Array.string} [options.classes] CSS classes to set on target div
     * @param {Array} [options.properties] string dictionary of CSS properties to set on target div
     * @param {Array} [options.attributes] string dictionary of HTML attributes to set on target div
     * @param {string} [options.content] inner (HTML) content of surface
     */
    function Surface(options) {
        ElementOutput.call(this);

        this.options = {};

        this.properties = {};
        this.attributes = {};
        this.content = '';
        this.classList = [];
        this.size = null;

        this._classesDirty = true;
        this._stylesDirty = true;
        this._attributesDirty = true;
        this._sizeDirty = true;
        this._contentDirty = true;
        this._trueSizeCheck = true;

        this._dirtyClasses = [];

        if (options) this.setOptions(options);

        this._currentTarget = null;
    }
    Surface.prototype = Object.create(ElementOutput.prototype);
    Surface.prototype.constructor = Surface;
    Surface.prototype.elementType = 'div';
    Surface.prototype.elementClass = 'famous-surface';

    /**
     * Set HTML attributes on this Surface. Note that this will cause
     *    dirtying and thus re-rendering, even if values do not change.
     *
     * @method setAttributes
    * @param {Object} attributes property dictionary of "key" => "value"
     */
    Surface.prototype.setAttributes = function setAttributes(attributes) {
        for (var n in attributes) {
            if (n === 'style') throw new Error('Cannot set styles via "setAttributes" as it will break Famo.us.  Use "setProperties" instead.');
            this.attributes[n] = attributes[n];
        }
        this._attributesDirty = true;
    };

    /**
     * Get HTML attributes on this Surface.
     *
     * @method getAttributes
     *
     * @return {Object} Dictionary of this Surface's attributes.
     */
    Surface.prototype.getAttributes = function getAttributes() {
        return this.attributes;
    };

    /**
     * Set CSS-style properties on this Surface. Note that this will cause
     *    dirtying and thus re-rendering, even if values do not change.
     *
     * @method setProperties
     * @chainable
     * @param {Object} properties property dictionary of "key" => "value"
     */
    Surface.prototype.setProperties = function setProperties(properties) {
        for (var n in properties) {
            this.properties[n] = properties[n];
        }
        this._stylesDirty = true;
        return this;
    };

    /**
     * Get CSS-style properties on this Surface.
     *
     * @method getProperties
     *
     * @return {Object} Dictionary of this Surface's properties.
     */
    Surface.prototype.getProperties = function getProperties() {
        return this.properties;
    };

    /**
     * Add CSS-style class to the list of classes on this Surface. Note
     *   this will map directly to the HTML property of the actual
     *   corresponding rendered <div>.
     *
     * @method addClass
     * @chainable
     * @param {string} className name of class to add
     */
    Surface.prototype.addClass = function addClass(className) {
        if (this.classList.indexOf(className) < 0) {
            this.classList.push(className);
            this._classesDirty = true;
        }
        return this;
    };

    /**
     * Remove CSS-style class from the list of classes on this Surface.
     *   Note this will map directly to the HTML property of the actual
     *   corresponding rendered <div>.
     *
     * @method removeClass
     * @chainable
     * @param {string} className name of class to remove
     */
    Surface.prototype.removeClass = function removeClass(className) {
        var i = this.classList.indexOf(className);
        if (i >= 0) {
            this._dirtyClasses.push(this.classList.splice(i, 1)[0]);
            this._classesDirty = true;
        }
        return this;
    };

    /**
     * Toggle CSS-style class from the list of classes on this Surface.
     *   Note this will map directly to the HTML property of the actual
     *   corresponding rendered <div>.
     *
     * @method toggleClass
     * @param {string} className name of class to toggle
     */
    Surface.prototype.toggleClass = function toggleClass(className) {
        var i = this.classList.indexOf(className);
        if (i >= 0) {
            this.removeClass(className);
        } else {
            this.addClass(className);
        }
        return this;
    };

    /**
     * Reset class list to provided dictionary.
     * @method setClasses
     * @chainable
     * @param {Array.string} classList
     */
    Surface.prototype.setClasses = function setClasses(classList) {
        var i = 0;
        var removal = [];
        for (i = 0; i < this.classList.length; i++) {
            if (classList.indexOf(this.classList[i]) < 0) removal.push(this.classList[i]);
        }
        for (i = 0; i < removal.length; i++) this.removeClass(removal[i]);
        // duplicates are already checked by addClass()
        for (i = 0; i < classList.length; i++) this.addClass(classList[i]);
        return this;
    };

    /**
     * Get array of CSS-style classes attached to this div.
     *
     * @method getClasslist
     * @return {Array.string} array of class names
     */
    Surface.prototype.getClassList = function getClassList() {
        return this.classList;
    };

    /**
     * Set or overwrite inner (HTML) content of this surface. Note that this
     *    causes a re-rendering if the content has changed.
     *
     * @method setContent
     * @chainable
     * @param {string|Document Fragment} content HTML content
     */
    Surface.prototype.setContent = function setContent(content) {
        if (this.content !== content) {
            this.content = content;
            this._contentDirty = true;
        }
        return this;
    };

    /**
     * Return inner (HTML) content of this surface.
     *
     * @method getContent
     *
     * @return {string} inner (HTML) content
     */
    Surface.prototype.getContent = function getContent() {
        return this.content;
    };

    /**
     * Set options for this surface
     *
     * @method setOptions
     * @chainable
     * @param {Object} [options] overrides for default options.  See constructor.
     */
    Surface.prototype.setOptions = function setOptions(options) {
        if (options.size) this.setSize(options.size);
        if (options.classes) this.setClasses(options.classes);
        if (options.properties) this.setProperties(options.properties);
        if (options.attributes) this.setAttributes(options.attributes);
        if (options.content) this.setContent(options.content);
        return this;
    };

    //  Apply to document all changes from removeClass() since last setup().
    function _cleanupClasses(target) {
        for (var i = 0; i < this._dirtyClasses.length; i++) target.classList.remove(this._dirtyClasses[i]);
        this._dirtyClasses = [];
    }

    // Apply values of all Famous-managed styles to the document element.
    //  These will be deployed to the document on call to #setup().
    function _applyStyles(target) {
        for (var n in this.properties) {
            target.style[n] = this.properties[n];
        }
    }

    // Clear all Famous-managed styles from the document element.
    // These will be deployed to the document on call to #setup().
    function _cleanupStyles(target) {
        for (var n in this.properties) {
            target.style[n] = '';
        }
    }

    // Apply values of all Famous-managed attributes to the document element.
    //  These will be deployed to the document on call to #setup().
    function _applyAttributes(target) {
        for (var n in this.attributes) {
            target.setAttribute(n, this.attributes[n]);
        }
    }

    // Clear all Famous-managed attributes from the document element.
    // These will be deployed to the document on call to #setup().
    function _cleanupAttributes(target) {
        for (var n in this.attributes) {
            target.removeAttribute(n);
        }
    }

    function _xyNotEquals(a, b) {
        return (a && b) ? (a[0] !== b[0] || a[1] !== b[1]) : a !== b;
    }

    /**
     * One-time setup for an element to be ready for commits to document.
     *
     * @private
     * @method setup
     *
     * @param {ElementAllocator} allocator document element pool for this context
     */
    Surface.prototype.setup = function setup(allocator) {
        var target = allocator.allocate(this.elementType);
        if (this.elementClass) {
            if (this.elementClass instanceof Array) {
                for (var i = 0; i < this.elementClass.length; i++) {
                    target.classList.add(this.elementClass[i]);
                }
            }
            else {
                target.classList.add(this.elementClass);
            }
        }
        target.style.display = '';
        this.attach(target);
        this._opacity = null;
        this._currentTarget = target;
        this._stylesDirty = true;
        this._classesDirty = true;
        this._attributesDirty = true;
        this._sizeDirty = true;
        this._contentDirty = true;
        this._originDirty = true;
        this._transformDirty = true;
    };

    /**
     * Apply changes from this component to the corresponding document element.
     * This includes changes to classes, styles, size, content, opacity, origin,
     * and matrix transforms.
     *
     * @private
     * @method commit
     * @param {Context} context commit context
     */
    Surface.prototype.commit = function commit(context) {
        if (!this._currentTarget) this.setup(context.allocator);
        var target = this._currentTarget;
        var size = context.size;

        if (this._classesDirty) {
            _cleanupClasses.call(this, target);
            var classList = this.getClassList();
            for (var i = 0; i < classList.length; i++) target.classList.add(classList[i]);
            this._classesDirty = false;
            this._trueSizeCheck = true;
        }

        if (this._stylesDirty) {
            _applyStyles.call(this, target);
            this._stylesDirty = false;
            this._trueSizeCheck = true;
        }

        if (this._attributesDirty) {
            _applyAttributes.call(this, target);
            this._attributesDirty = false;
            this._trueSizeCheck = true;
        }

        if (this.size) {
            var origSize = context.size;
            size = [this.size[0], this.size[1]];
            if (size[0] === undefined) size[0] = origSize[0];
            if (size[1] === undefined) size[1] = origSize[1];
            if (size[0] === true || size[1] === true) {
                if (size[0] === true){
                    if (this._trueSizeCheck || (this._size[0] === 0)) {
                        var width = target.offsetWidth;
                        if (this._size && this._size[0] !== width) {
                            this._size[0] = width;
                            this._sizeDirty = true;
                        }
                        size[0] = width;
                    } else {
                        if (this._size) size[0] = this._size[0];
                    }
                }
                if (size[1] === true){
                    if (this._trueSizeCheck || (this._size[1] === 0)) {
                        var height = target.offsetHeight;
                        if (this._size && this._size[1] !== height) {
                            this._size[1] = height;
                            this._sizeDirty = true;
                        }
                        size[1] = height;
                    } else {
                        if (this._size) size[1] = this._size[1];
                    }
                }
                this._trueSizeCheck = false;
            }
        }

        if (_xyNotEquals(this._size, size)) {
            if (!this._size) this._size = [0, 0];
            this._size[0] = size[0];
            this._size[1] = size[1];

            this._sizeDirty = true;
        }

        if (this._sizeDirty) {
            if (this._size) {
                target.style.width = (this.size && this.size[0] === true) ? '' : this._size[0] + 'px';
                target.style.height = (this.size && this.size[1] === true) ?  '' : this._size[1] + 'px';
            }

            this._eventOutput.emit('resize');
        }

        if (this._contentDirty) {
            this.deploy(target);
            this._eventOutput.emit('deploy');
            this._contentDirty = false;
            this._trueSizeCheck = true;
        }

        ElementOutput.prototype.commit.call(this, context);
    };

    /**
     *  Remove all Famous-relevant attributes from a document element.
     *    This is called by SurfaceManager's detach().
     *    This is in some sense the reverse of .deploy().
     *
     * @private
     * @method cleanup
     * @param {ElementAllocator} allocator
     */
    Surface.prototype.cleanup = function cleanup(allocator) {
        var i = 0;
        var target = this._currentTarget;
        this._eventOutput.emit('recall');
        this.recall(target);
        target.style.display = 'none';
        target.style.opacity = '';
        target.style.width = '';
        target.style.height = '';
        _cleanupStyles.call(this, target);
        _cleanupAttributes.call(this, target);
        var classList = this.getClassList();
        _cleanupClasses.call(this, target);
        for (i = 0; i < classList.length; i++) target.classList.remove(classList[i]);
        if (this.elementClass) {
            if (this.elementClass instanceof Array) {
                for (i = 0; i < this.elementClass.length; i++) {
                    target.classList.remove(this.elementClass[i]);
                }
            }
            else {
                target.classList.remove(this.elementClass);
            }
        }
        this.detach(target);
        this._currentTarget = null;
        allocator.deallocate(target);
    };

    /**
     * Place the document element that this component manages into the document.
     *
     * @private
     * @method deploy
     * @param {Node} target document parent of this container
     */
    Surface.prototype.deploy = function deploy(target) {
        var content = this.getContent();
        if (content instanceof Node) {
            while (target.hasChildNodes()) target.removeChild(target.firstChild);
            target.appendChild(content);
        }
        else target.innerHTML = content;
    };

    /**
     * Remove any contained document content associated with this surface
     *   from the actual document.
     *
     * @private
     * @method recall
     */
    Surface.prototype.recall = function recall(target) {
        var df = document.createDocumentFragment();
        while (target.hasChildNodes()) df.appendChild(target.firstChild);
        this.setContent(df);
    };

    /**
     *  Get the x and y dimensions of the surface.
     *
     * @method getSize
     * @return {Array.Number} [x,y] size of surface
     */
    Surface.prototype.getSize = function getSize() {
        return this._size ? this._size : this.size;
    };

    /**
     * Set x and y dimensions of the surface.
     *
     * @method setSize
     * @chainable
     * @param {Array.Number} size as [width, height]
     */
    Surface.prototype.setSize = function setSize(size) {
        this.size = size ? [size[0], size[1]] : null;
        this._sizeDirty = true;
        return this;
    };

    module.exports = Surface;
});

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: david@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define('famous/transitions/TransitionableTransform',['require','exports','module','./Transitionable','../core/Transform','../utilities/Utility'],function(require, exports, module) {
    var Transitionable = require('./Transitionable');
    var Transform = require('../core/Transform');
    var Utility = require('../utilities/Utility');

    /**
     * A class for transitioning the state of a Transform by transitioning
     * its translate, scale, skew and rotate components independently.
     *
     * @class TransitionableTransform
     * @constructor
     *
     * @param [transform=Transform.identity] {Transform} The initial transform state
     */
    function TransitionableTransform(transform) {
        this._final = Transform.identity.slice();

        this._finalTranslate = [0, 0, 0];
        this._finalRotate = [0, 0, 0];
        this._finalSkew = [0, 0, 0];
        this._finalScale = [1, 1, 1];

        this.translate = new Transitionable(this._finalTranslate);
        this.rotate = new Transitionable(this._finalRotate);
        this.skew = new Transitionable(this._finalSkew);
        this.scale = new Transitionable(this._finalScale);

        if (transform) this.set(transform);
    }

    function _build() {
        return Transform.build({
            translate: this.translate.get(),
            rotate: this.rotate.get(),
            skew: this.skew.get(),
            scale: this.scale.get()
        });
    }

    function _buildFinal() {
        return Transform.build({
            translate: this._finalTranslate,
            rotate: this._finalRotate,
            skew: this._finalSkew,
            scale: this._finalScale
        });
    }

    /**
     * An optimized way of setting only the translation component of a Transform
     *
     * @method setTranslate
     * @chainable
     *
     * @param translate {Array}     New translation state
     * @param [transition] {Object} Transition definition
     * @param [callback] {Function} Callback
     * @return {TransitionableTransform}
     */
    TransitionableTransform.prototype.setTranslate = function setTranslate(translate, transition, callback) {
        this._finalTranslate = translate;
        this._final = _buildFinal.call(this);
        this.translate.set(translate, transition, callback);
        return this;
    };

    /**
     * An optimized way of setting only the scale component of a Transform
     *
     * @method setScale
     * @chainable
     *
     * @param scale {Array}         New scale state
     * @param [transition] {Object} Transition definition
     * @param [callback] {Function} Callback
     * @return {TransitionableTransform}
     */
    TransitionableTransform.prototype.setScale = function setScale(scale, transition, callback) {
        this._finalScale = scale;
        this._final = _buildFinal.call(this);
        this.scale.set(scale, transition, callback);
        return this;
    };

    /**
     * An optimized way of setting only the rotational component of a Transform
     *
     * @method setRotate
     * @chainable
     *
     * @param eulerAngles {Array}   Euler angles for new rotation state
     * @param [transition] {Object} Transition definition
     * @param [callback] {Function} Callback
     * @return {TransitionableTransform}
     */
    TransitionableTransform.prototype.setRotate = function setRotate(eulerAngles, transition, callback) {
        this._finalRotate = eulerAngles;
        this._final = _buildFinal.call(this);
        this.rotate.set(eulerAngles, transition, callback);
        return this;
    };

    /**
     * An optimized way of setting only the skew component of a Transform
     *
     * @method setSkew
     * @chainable
     *
     * @param skewAngles {Array}    New skew state
     * @param [transition] {Object} Transition definition
     * @param [callback] {Function} Callback
     * @return {TransitionableTransform}
     */
    TransitionableTransform.prototype.setSkew = function setSkew(skewAngles, transition, callback) {
        this._finalSkew = skewAngles;
        this._final = _buildFinal.call(this);
        this.skew.set(skewAngles, transition, callback);
        return this;
    };

    /**
     * Setter for a TransitionableTransform with optional parameters to transition
     * between Transforms
     *
     * @method set
     * @chainable
     *
     * @param transform {Array}     New transform state
     * @param [transition] {Object} Transition definition
     * @param [callback] {Function} Callback
     * @return {TransitionableTransform}
     */
    TransitionableTransform.prototype.set = function set(transform, transition, callback) {
        var components = Transform.interpret(transform);

        this._finalTranslate = components.translate;
        this._finalRotate = components.rotate;
        this._finalSkew = components.skew;
        this._finalScale = components.scale;
        this._final = transform;

        var _callback = callback ? Utility.after(4, callback) : null;
        this.translate.set(components.translate, transition, _callback);
        this.rotate.set(components.rotate, transition, _callback);
        this.skew.set(components.skew, transition, _callback);
        this.scale.set(components.scale, transition, _callback);
        return this;
    };

    /**
     * Sets the default transition to use for transitioning betwen Transform states
     *
     * @method setDefaultTransition
     *
     * @param transition {Object} Transition definition
     */
    TransitionableTransform.prototype.setDefaultTransition = function setDefaultTransition(transition) {
        this.translate.setDefault(transition);
        this.rotate.setDefault(transition);
        this.skew.setDefault(transition);
        this.scale.setDefault(transition);
    };

    /**
     * Getter. Returns the current state of the Transform
     *
     * @method get
     *
     * @return {Transform}
     */
    TransitionableTransform.prototype.get = function get() {
        if (this.isActive()) {
            return _build.call(this);
        }
        else return this._final;
    };

    /**
     * Get the destination state of the Transform
     *
     * @method getFinal
     *
     * @return Transform {Transform}
     */
    TransitionableTransform.prototype.getFinal = function getFinal() {
        return this._final;
    };

    /**
     * Determine if the TransitionalTransform is currently transitioning
     *
     * @method isActive
     *
     * @return {Boolean}
     */
    TransitionableTransform.prototype.isActive = function isActive() {
        return this.translate.isActive() || this.rotate.isActive() || this.scale.isActive() || this.skew.isActive();
    };

    /**
     * Halts the transition
     *
     * @method halt
     */
    TransitionableTransform.prototype.halt = function halt() {
        this.translate.halt();
        this.rotate.halt();
        this.skew.halt();
        this.scale.halt();

        this._final = this.get();
        this._finalTranslate = this.translate.get();
        this._finalRotate = this.rotate.get();
        this._finalSkew = this.skew.get();
        this._finalScale = this.scale.get();

        return this;
    };

    module.exports = TransitionableTransform;
});

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: mark@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define('famous/core/Modifier',['require','exports','module','./Transform','../transitions/Transitionable','../transitions/TransitionableTransform'],function(require, exports, module) {
    var Transform = require('./Transform');

    /* TODO: remove these dependencies when deprecation complete */
    var Transitionable = require('../transitions/Transitionable');
    var TransitionableTransform = require('../transitions/TransitionableTransform');

    /**
     *
     *  A collection of visual changes to be
     *    applied to another renderable component. This collection includes a
     *    transform matrix, an opacity constant, a size, an origin specifier.
     *    Modifier objects can be added to any RenderNode or object
     *    capable of displaying renderables.  The Modifier's children and descendants
     *    are transformed by the amounts specified in the Modifier's properties.
     *
     * @class Modifier
     * @constructor
     * @param {Object} [options] overrides of default options
     * @param {Transform} [options.transform] affine transformation matrix
     * @param {Number} [options.opacity]
     * @param {Array.Number} [options.origin] origin adjustment
     * @param {Array.Number} [options.size] size to apply to descendants
     */
    function Modifier(options) {
        this._transformGetter = null;
        this._opacityGetter = null;
        this._originGetter = null;
        this._alignGetter = null;
        this._sizeGetter = null;
        this._proportionGetter = null;

        /* TODO: remove this when deprecation complete */
        this._legacyStates = {};

        this._output = {
            transform: Transform.identity,
            opacity: 1,
            origin: null,
            align: null,
            size: null,
            proportions: null,
            target: null
        };

        if (options) {
            if (options.transform) this.transformFrom(options.transform);
            if (options.opacity !== undefined) this.opacityFrom(options.opacity);
            if (options.origin) this.originFrom(options.origin);
            if (options.align) this.alignFrom(options.align);
            if (options.size) this.sizeFrom(options.size);
            if (options.proportions) this.proportionsFrom(options.proportions);
        }
    }

    /**
     * Function, object, or static transform matrix which provides the transform.
     *   This is evaluated on every tick of the engine.
     *
     * @method transformFrom
     *
     * @param {Object} transform transform provider object
     * @return {Modifier} this
     */
    Modifier.prototype.transformFrom = function transformFrom(transform) {
        if (transform instanceof Function) this._transformGetter = transform;
        else if (transform instanceof Object && transform.get) this._transformGetter = transform.get.bind(transform);
        else {
            this._transformGetter = null;
            this._output.transform = transform;
        }
        return this;
    };

    /**
     * Set function, object, or number to provide opacity, in range [0,1].
     *
     * @method opacityFrom
     *
     * @param {Object} opacity provider object
     * @return {Modifier} this
     */
    Modifier.prototype.opacityFrom = function opacityFrom(opacity) {
        if (opacity instanceof Function) this._opacityGetter = opacity;
        else if (opacity instanceof Object && opacity.get) this._opacityGetter = opacity.get.bind(opacity);
        else {
            this._opacityGetter = null;
            this._output.opacity = opacity;
        }
        return this;
    };

    /**
     * Set function, object, or numerical array to provide origin, as [x,y],
     *   where x and y are in the range [0,1].
     *
     * @method originFrom
     *
     * @param {Object} origin provider object
     * @return {Modifier} this
     */
    Modifier.prototype.originFrom = function originFrom(origin) {
        if (origin instanceof Function) this._originGetter = origin;
        else if (origin instanceof Object && origin.get) this._originGetter = origin.get.bind(origin);
        else {
            this._originGetter = null;
            this._output.origin = origin;
        }
        return this;
    };

    /**
     * Set function, object, or numerical array to provide align, as [x,y],
     *   where x and y are in the range [0,1].
     *
     * @method alignFrom
     *
     * @param {Object} align provider object
     * @return {Modifier} this
     */
    Modifier.prototype.alignFrom = function alignFrom(align) {
        if (align instanceof Function) this._alignGetter = align;
        else if (align instanceof Object && align.get) this._alignGetter = align.get.bind(align);
        else {
            this._alignGetter = null;
            this._output.align = align;
        }
        return this;
    };

    /**
     * Set function, object, or numerical array to provide size, as [width, height].
     *
     * @method sizeFrom
     *
     * @param {Object} size provider object
     * @return {Modifier} this
     */
    Modifier.prototype.sizeFrom = function sizeFrom(size) {
        if (size instanceof Function) this._sizeGetter = size;
        else if (size instanceof Object && size.get) this._sizeGetter = size.get.bind(size);
        else {
            this._sizeGetter = null;
            this._output.size = size;
        }
        return this;
    };

    /**
     * Set function, object, or numerical array to provide proportions, as [percent of width, percent of height].
     *
     * @method proportionsFrom
     *
     * @param {Object} proportions provider object
     * @return {Modifier} this
     */
    Modifier.prototype.proportionsFrom = function proportionsFrom(proportions) {
        if (proportions instanceof Function) this._proportionGetter = proportions;
        else if (proportions instanceof Object && proportions.get) this._proportionGetter = proportions.get.bind(proportions);
        else {
            this._proportionGetter = null;
            this._output.proportions = proportions;
        }
        return this;
    };

     /**
     * Deprecated: Prefer transformFrom with static Transform, or use a TransitionableTransform.
     * @deprecated
     * @method setTransform
     *
     * @param {Transform} transform Transform to transition to
     * @param {Transitionable} transition Valid transitionable object
     * @param {Function} callback callback to call after transition completes
     * @return {Modifier} this
     */
    Modifier.prototype.setTransform = function setTransform(transform, transition, callback) {
        if (transition || this._legacyStates.transform) {
            if (!this._legacyStates.transform) {
                this._legacyStates.transform = new TransitionableTransform(this._output.transform);
            }
            if (!this._transformGetter) this.transformFrom(this._legacyStates.transform);

            this._legacyStates.transform.set(transform, transition, callback);
            return this;
        }
        else return this.transformFrom(transform);
    };

    /**
     * Deprecated: Prefer opacityFrom with static opacity array, or use a Transitionable with that opacity.
     * @deprecated
     * @method setOpacity
     *
     * @param {Number} opacity Opacity value to transition to.
     * @param {Transitionable} transition Valid transitionable object
     * @param {Function} callback callback to call after transition completes
     * @return {Modifier} this
     */
    Modifier.prototype.setOpacity = function setOpacity(opacity, transition, callback) {
        if (transition || this._legacyStates.opacity) {
            if (!this._legacyStates.opacity) {
                this._legacyStates.opacity = new Transitionable(this._output.opacity);
            }
            if (!this._opacityGetter) this.opacityFrom(this._legacyStates.opacity);

            return this._legacyStates.opacity.set(opacity, transition, callback);
        }
        else return this.opacityFrom(opacity);
    };

    /**
     * Deprecated: Prefer originFrom with static origin array, or use a Transitionable with that origin.
     * @deprecated
     * @method setOrigin
     *
     * @param {Array.Number} origin two element array with values between 0 and 1.
     * @param {Transitionable} transition Valid transitionable object
     * @param {Function} callback callback to call after transition completes
     * @return {Modifier} this
     */
    Modifier.prototype.setOrigin = function setOrigin(origin, transition, callback) {
        /* TODO: remove this if statement when deprecation complete */
        if (transition || this._legacyStates.origin) {

            if (!this._legacyStates.origin) {
                this._legacyStates.origin = new Transitionable(this._output.origin || [0, 0]);
            }
            if (!this._originGetter) this.originFrom(this._legacyStates.origin);

            this._legacyStates.origin.set(origin, transition, callback);
            return this;
        }
        else return this.originFrom(origin);
    };

    /**
     * Deprecated: Prefer alignFrom with static align array, or use a Transitionable with that align.
     * @deprecated
     * @method setAlign
     *
     * @param {Array.Number} align two element array with values between 0 and 1.
     * @param {Transitionable} transition Valid transitionable object
     * @param {Function} callback callback to call after transition completes
     * @return {Modifier} this
     */
    Modifier.prototype.setAlign = function setAlign(align, transition, callback) {
        /* TODO: remove this if statement when deprecation complete */
        if (transition || this._legacyStates.align) {

            if (!this._legacyStates.align) {
                this._legacyStates.align = new Transitionable(this._output.align || [0, 0]);
            }
            if (!this._alignGetter) this.alignFrom(this._legacyStates.align);

            this._legacyStates.align.set(align, transition, callback);
            return this;
        }
        else return this.alignFrom(align);
    };

    /**
     * Deprecated: Prefer sizeFrom with static origin array, or use a Transitionable with that size.
     * @deprecated
     * @method setSize
     * @param {Array.Number} size two element array of [width, height]
     * @param {Transitionable} transition Valid transitionable object
     * @param {Function} callback callback to call after transition completes
     * @return {Modifier} this
     */
    Modifier.prototype.setSize = function setSize(size, transition, callback) {
        if (size && (transition || this._legacyStates.size)) {
            if (!this._legacyStates.size) {
                this._legacyStates.size = new Transitionable(this._output.size || [0, 0]);
            }
            if (!this._sizeGetter) this.sizeFrom(this._legacyStates.size);

            this._legacyStates.size.set(size, transition, callback);
            return this;
        }
        else return this.sizeFrom(size);
    };

    /**
     * Deprecated: Prefer proportionsFrom with static origin array, or use a Transitionable with those proportions.
     * @deprecated
     * @method setProportions
     * @param {Array.Number} proportions two element array of [percent of width, percent of height]
     * @param {Transitionable} transition Valid transitionable object
     * @param {Function} callback callback to call after transition completes
     * @return {Modifier} this
     */
    Modifier.prototype.setProportions = function setProportions(proportions, transition, callback) {
        if (proportions && (transition || this._legacyStates.proportions)) {
            if (!this._legacyStates.proportions) {
                this._legacyStates.proportions = new Transitionable(this._output.proportions || [0, 0]);
            }
            if (!this._proportionGetter) this.proportionsFrom(this._legacyStates.proportions);

            this._legacyStates.proportions.set(proportions, transition, callback);
            return this;
        }
        else return this.proportionsFrom(proportions);
    };

    /**
     * Deprecated: Prefer to stop transform in your provider object.
     * @deprecated
     * @method halt
     */
    Modifier.prototype.halt = function halt() {
        if (this._legacyStates.transform) this._legacyStates.transform.halt();
        if (this._legacyStates.opacity) this._legacyStates.opacity.halt();
        if (this._legacyStates.origin) this._legacyStates.origin.halt();
        if (this._legacyStates.align) this._legacyStates.align.halt();
        if (this._legacyStates.size) this._legacyStates.size.halt();
        if (this._legacyStates.proportions) this._legacyStates.proportions.halt();
        this._transformGetter = null;
        this._opacityGetter = null;
        this._originGetter = null;
        this._alignGetter = null;
        this._sizeGetter = null;
        this._proportionGetter = null;
    };

    /**
     * Deprecated: Prefer to use your provided transform or output of your transform provider.
     * @deprecated
     * @method getTransform
     * @return {Object} transform provider object
     */
    Modifier.prototype.getTransform = function getTransform() {
        return this._transformGetter();
    };

    /**
     * Deprecated: Prefer to determine the end state of your transform from your transform provider
     * @deprecated
     * @method getFinalTransform
     * @return {Transform} transform matrix
     */
    Modifier.prototype.getFinalTransform = function getFinalTransform() {
        return this._legacyStates.transform ? this._legacyStates.transform.getFinal() : this._output.transform;
    };

    /**
     * Deprecated: Prefer to use your provided opacity or output of your opacity provider.
     * @deprecated
     * @method getOpacity
     * @return {Object} opacity provider object
     */
    Modifier.prototype.getOpacity = function getOpacity() {
        return this._opacityGetter();
    };

    /**
     * Deprecated: Prefer to use your provided origin or output of your origin provider.
     * @deprecated
     * @method getOrigin
     * @return {Object} origin provider object
     */
    Modifier.prototype.getOrigin = function getOrigin() {
        return this._originGetter();
    };

    /**
     * Deprecated: Prefer to use your provided align or output of your align provider.
     * @deprecated
     * @method getAlign
     * @return {Object} align provider object
     */
    Modifier.prototype.getAlign = function getAlign() {
        return this._alignGetter();
    };

    /**
     * Deprecated: Prefer to use your provided size or output of your size provider.
     * @deprecated
     * @method getSize
     * @return {Object} size provider object
     */
    Modifier.prototype.getSize = function getSize() {
        return this._sizeGetter ? this._sizeGetter() : this._output.size;
    };

    /**
     * Deprecated: Prefer to use your provided proportions or output of your proportions provider.
     * @deprecated
     * @method getProportions
     * @return {Object} proportions provider object
     */
    Modifier.prototype.getProportions = function getProportions() {
        return this._proportionGetter ? this._proportionGetter() : this._output.proportions;
    };

    // call providers on tick to receive render spec elements to apply
    function _update() {
        if (this._transformGetter) this._output.transform = this._transformGetter();
        if (this._opacityGetter) this._output.opacity = this._opacityGetter();
        if (this._originGetter) this._output.origin = this._originGetter();
        if (this._alignGetter) this._output.align = this._alignGetter();
        if (this._sizeGetter) this._output.size = this._sizeGetter();
        if (this._proportionGetter) this._output.proportions = this._proportionGetter();
    }

    /**
     * Return render spec for this Modifier, applying to the provided
     *    target component.  This is similar to render() for Surfaces.
     *
     * @private
     * @method modify
     *
     * @param {Object} target (already rendered) render spec to
     *    which to apply the transform.
     * @return {Object} render spec for this Modifier, including the
     *    provided target
     */
    Modifier.prototype.modify = function modify(target) {
        _update.call(this);
        this._output.target = target;
        return this._output;
    };

    module.exports = Modifier;
});

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: mark@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define('famous/core/View',['require','exports','module','./EventHandler','./OptionsManager','./RenderNode','../utilities/Utility'],function(require, exports, module) {
    var EventHandler = require('./EventHandler');
    var OptionsManager = require('./OptionsManager');
    var RenderNode = require('./RenderNode');
    var Utility = require('../utilities/Utility');

    /**
     * Useful for quickly creating elements within applications
     *   with large event systems.  Consists of a RenderNode paired with
     *   an input EventHandler and an output EventHandler.
     *   Meant to be extended by the developer.
     *
     * @class View
     * @uses EventHandler
     * @uses OptionsManager
     * @uses RenderNode
     * @constructor
     */
    function View(options) {
        this._node = new RenderNode();

        this._eventInput = new EventHandler();
        this._eventOutput = new EventHandler();
        EventHandler.setInputHandler(this, this._eventInput);
        EventHandler.setOutputHandler(this, this._eventOutput);

        this.options = Utility.clone(this.constructor.DEFAULT_OPTIONS || View.DEFAULT_OPTIONS);
        this._optionsManager = new OptionsManager(this.options);

        if (options) this.setOptions(options);
    }

    View.DEFAULT_OPTIONS = {}; // no defaults

    /**
     * Look up options value by key
     * @method getOptions
     *
     * @param {string} key key
     * @return {Object} associated object
     */
    View.prototype.getOptions = function getOptions(key) {
        return this._optionsManager.getOptions(key);
    };

    /*
     *  Set internal options.
     *  No defaults options are set in View.
     *
     *  @method setOptions
     *  @param {Object} options
     */
    View.prototype.setOptions = function setOptions(options) {
        this._optionsManager.patch(options);
    };

    /**
     * Add a child renderable to the view.
     *   Note: This is meant to be used by an inheriting class
     *   rather than from outside the prototype chain.
     *
     * @method add
     * @return {RenderNode}
     * @protected
     */
    View.prototype.add = function add() {
        return this._node.add.apply(this._node, arguments);
    };

    /**
     * Alias for add
     * @method _add
     */
    View.prototype._add = View.prototype.add;

    /**
     * Generate a render spec from the contents of this component.
     *
     * @private
     * @method render
     * @return {number} Render spec for this component
     */
    View.prototype.render = function render() {
        return this._node.render();
    };

    /**
     * Return size of contained element.
     *
     * @method getSize
     * @return {Array.Number} [width, height]
     */
    View.prototype.getSize = function getSize() {
        if (this._node && this._node.getSize) {
            return this._node.getSize.apply(this._node, arguments) || this.options.size;
        }
        else return this.options.size;
    };

    module.exports = View;
});

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: mark@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */
define('famous/inputs/SyncUtils',['require','exports','module'],function(require, exports, module) {
    module.exports = {
        getTimeHistoryPosition: function getTimeHistoryPosition(history, timeSampleDuration) {
            var len = history.length - 1;
            var index = len;
            var searching = true;
            var timeSearched = 0;

            var lastHist;
            var hist;
            var diffTime;

            while (searching) {
                hist = history[index];
                if (index < 0) return lastHist;

                if (hist && lastHist) {
                    diffTime = lastHist.timestamp - hist.timestamp;
                    timeSearched += diffTime;
                    if (timeSearched >= timeSampleDuration) {
                        searching = false;
                        return hist;
                    }
                }

                index--;
                lastHist = hist;
            }
        }
    };
});

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: mark@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */
define('famous/inputs/MouseSync',['require','exports','module','../core/EventHandler','../core/OptionsManager','./SyncUtils'],function(require, exports, module) {
    var EventHandler = require('../core/EventHandler');
    var OptionsManager = require('../core/OptionsManager');
    var SyncUtils = require('./SyncUtils');

    /**
     * Handles piped in mouse drag events. Outputs an object with the position delta from last frame, position from start,
     * current velocity averaged out over the velocitySampleLength (set via options), clientX, clientY, offsetX, and offsetY.
     *
     * Emits 'start', 'update' and 'end' events. Designed to be used either as a standalone MouseSync, or as part of a
     * GenericSync.
     *
     * @class MouseSync
     * @constructor
     *
     * @example
     *   var Surface = require('../core/Surface');
     *   var MouseSync = require('../inputs/MouseSync');
     *
     *   var surface = new Surface({ size: [100, 100] });
     *   var mouseSync = new MouseSync();
     *   surface.pipe(mouseSync);
     *
     *   mouseSync.on('start', function (e) { // react to start });
     *   mouseSync.on('update', function (e) { // react to update });
     *   mouseSync.on('end', function (e) { // react to end });
     *
     * @param [options] {Object}                An object of the following configurable options.
     * @param [options.clickThreshold] {Number} Absolute distance from click origin that will still trigger a click.
     * @param [options.direction] {Number}      Read from a particular axis. Valid options are: undefined, 0 or 1. 0 corresponds to x, and 1 to y. Default is undefined, which allows both x and y.
     * @param [options.rails] {Boolean}         Read from axis with the greatest differential.
     * @param [options.velocitySampleLength] {Number}  Number of previous frames to check velocity against.
     * @param [options.propogate] {Boolean}     Add a listener to document on mouseleave. This allows drag events to continue across the entire page.
     */
    function MouseSync(options) {
        this.options =  Object.create(MouseSync.DEFAULT_OPTIONS);
        this._optionsManager = new OptionsManager(this.options);

        if (options) this.setOptions(options);

        this._eventInput = new EventHandler();
        this._eventOutput = new EventHandler();

        EventHandler.setInputHandler(this, this._eventInput);
        EventHandler.setOutputHandler(this, this._eventOutput);

        this._eventInput.on('mousedown', _handleStart.bind(this));
        this._eventInput.on('mousemove', _handleMove.bind(this));
        this._eventInput.on('mouseup', _handleEnd.bind(this));

        if (this.options.propogate) this._eventInput.on('mouseleave', _handleLeave.bind(this));
        else this._eventInput.on('mouseleave', _handleEnd.bind(this));

        if (this.options.clickThreshold) {
            window.addEventListener('click', function(event) {
                if (Math.sqrt(Math.pow(this._displacement[0], 2) + Math.pow(this._displacement[1], 2)) > this.options.clickThreshold) {
                    event.stopPropagation();
                }
            }.bind(this), true);
        }

        this._payload = {
            delta    : null,
            position : null,
            velocity : null,
            clientX  : 0,
            clientY  : 0,
            offsetX  : 0,
            offsetY  : 0
        };

        this._positionHistory = [];
        this._position = null;      // to be deprecated
        this._down = false;
        this._moved = false;
        this._displacement = [0,0];
        this._documentActive = false;
    }

    MouseSync.DEFAULT_OPTIONS = {
        clickThreshold: undefined,
        direction: undefined,
        rails: false,
        scale: 1,
        propogate: true,  // events piped to document on mouseleave
        velocitySampleLength: 10,
        timeSampleDuration: 400,
        preventDefault: true
    };

    MouseSync.DIRECTION_X = 0;
    MouseSync.DIRECTION_Y = 1;

    var MINIMUM_TICK_TIME = 8;

    /**
     *  Triggered by mousedown.
     *
     *  @method _handleStart
     *  @private
     */
    function _handleStart(event) {
        var delta;
        var velocity;
        if (this.options.preventDefault) event.preventDefault(); // prevent drag

        var x = event.clientX;
        var y = event.clientY;
        var currTime = Date.now();

        this._down = true;
        this._move = false;

        if (this.options.direction !== undefined) {
            this._position = 0;
            delta = 0;
            velocity = 0;
        }
        else {
            this._position = [0, 0];
            delta = [0, 0];
            velocity = [0, 0];
        }

        if (this.options.clickThreshold) {
            this._displacement = [0,0];
        }

        var payload = this._payload;
        payload.delta = delta;
        payload.position = this._position;
        payload.velocity = velocity;
        payload.clientX = x;
        payload.clientY = y;
        payload.offsetX = event.offsetX;
        payload.offsetY = event.offsetY;

        this._positionHistory.push({
            position: payload.position.slice ? payload.position.slice(0) : payload.position,
            clientPosition: [x, y],
            timestamp: currTime
        });
        this._eventOutput.emit('start', payload);
        this._documentActive = false;
    }

    /**
     *  Triggered by mousemove.
     *
     *  @method _handleMove
     *  @private
     */
    function _handleMove(event) {
        if (this._positionHistory.length === 0) return;
        var payload = calculatePayload.call(this, event);
        this._eventOutput.emit('update', payload);
        this._move = true;
    }

    /**
     *  Triggered by mouseup on the element or document body if propagation is enabled, or
     *  mouseleave if propagation is off.
     *
     *  @method _handleEnd
     *  @private
     */
    function _handleEnd(event) {
        if (!this._down) return;
        var payload = calculatePayload.call(this, event);
        this._eventOutput.emit('end', payload);
        this._down = false;
        this._move = false;
        this._positionHistory = [];
    }

    /**
     *  Switches the mousemove listener to the document body, if propagation is enabled.
     *  @method _handleLeave
     *  @private
     */
    function _handleLeave(event) {
        if (!this._down || !this._move) return;

        if (!this._documentActive) {
          var boundMove = _handleMove.bind(this);
          var boundEnd = function(event) {
              _handleEnd.call(this, event);
              document.removeEventListener('mousemove', boundMove);
              document.removeEventListener('mouseup', boundEnd);
          }.bind(this);
          document.addEventListener('mousemove', boundMove);
          document.addEventListener('mouseup', boundEnd);
          this._documentActive = true;
        }
    }

    /**
     *  Calculates the data to send to listeners.
     *  @method calculatePayload
     *  @private
     */
    function calculatePayload (event) {
        var payload = this._payload;

        var scale = this.options.scale;
        var nextVel;
        var nextDelta;

        var x = event.clientX;
        var y = event.clientY;

        var currTime = Date.now();

        var lastPos = this._positionHistory[this._positionHistory.length - 1];
        var diffX = (x * scale) - lastPos.clientPosition[0];
        var diffY = (y * scale) - lastPos.clientPosition[1];

        if (this.options.rails) {
            if (Math.abs(diffX) > Math.abs(diffY)) diffY = 0;
            else diffX = 0;
        }
        if (this.options.direction === MouseSync.DIRECTION_X) {
            nextDelta = diffX;
            this._position += nextDelta;
        }
        else if (this.options.direction === MouseSync.DIRECTION_Y) {
            nextDelta = diffY;
            this._position += nextDelta;
        }
        else {
            nextDelta = [diffX, diffY];
            this._position[0] += diffX;
            this._position[1] += diffY;
        }

        if (this.options.clickThreshold !== false) {
            this._displacement[0] += diffX;
            this._displacement[1] += diffY;
        }

        payload.delta    = nextDelta;
        payload.position = this._position;
        payload.clientX  = x;
        payload.clientY  = y;
        payload.offsetX  = event.offsetX;
        payload.offsetY  = event.offsetY;

        if (this._positionHistory.length === this.options.velocitySampleLength) {
            this._positionHistory.shift();
        }

        this._positionHistory.push({
            position: payload.position.slice ? payload.position.slice(0) : payload.position,
            clientPosition: [x, y],
            timestamp: currTime
        });

        // Calculate velocity
        var lastPositionHistory = SyncUtils.getTimeHistoryPosition(this._positionHistory, this.options.timeSampleDuration);
        var diffTime = Math.max(currTime - lastPositionHistory.timestamp, MINIMUM_TICK_TIME); // minimum tick time

        if (this.options.direction !== undefined) {
            nextVel = scale * (this._position - lastPositionHistory.position) / diffTime;
        }
        else {
            nextVel = [
                scale * (this._position[0] - lastPositionHistory.position[0]) / diffTime,
                scale * (this._position[1] - lastPositionHistory.position[1]) / diffTime
            ];
        }

        payload.velocity = nextVel;

        return payload;
    }

    /**
     * Return entire options dictionary, including defaults.
     *
     * @method getOptions
     * @return {Object} configuration options
     */
    MouseSync.prototype.getOptions = function getOptions() {
        return this.options;
    };

    /**
     * Set internal options, overriding any default options
     *
     * @method setOptions
     *
     * @param [options] {Object}             default options overrides
     * @param [options.direction] {Number}   read from a particular axis
     * @param [options.rails] {Boolean}      read from axis with greatest differential
     * @param [options.propogate] {Boolean}  add listened to document on mouseleave
     */
    MouseSync.prototype.setOptions = function setOptions(options) {
        return this._optionsManager.setOptions(options);
    };

    module.exports = MouseSync;
});

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: mark@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */
define('famous/inputs/GenericSync',['require','exports','module','../core/EventHandler'],function(require, exports, module) {

    var EventHandler = require('../core/EventHandler');

    /**
     * Combines multiple types of sync classes (e.g. mouse, touch,
     *  scrolling) into one standardized interface for inclusion in widgets.
     *
     *  Sync classes are first registered with a key, and then can be accessed
     *  globally by key.
     *
     *  Emits 'start', 'update' and 'end' events as a union of the sync class
     *  providers.
     *
     * @class GenericSync
     * @constructor
     * @param syncs {Object|Array} object with fields {sync key : sync options}
     *    or an array of registered sync keys
     * @param [options] {Object|Array} options object to set on all syncs
     */
    function GenericSync(syncs, options) {
        this._eventInput = new EventHandler();
        this._eventOutput = new EventHandler();

        EventHandler.setInputHandler(this, this._eventInput);
        EventHandler.setOutputHandler(this, this._eventOutput);

        this._syncs = {};
        if (syncs) this.addSync(syncs);
        if (options) this.setOptions(options);
    }

    GenericSync.DIRECTION_X = 0;
    GenericSync.DIRECTION_Y = 1;
    GenericSync.DIRECTION_Z = 2;

    // Global registry of sync classes. Append only.
    var registry = {};

    /**
     * Register a global sync class with an identifying key
     *
     * @static
     * @method register
     *
     * @param syncObject {Object} an object of {sync key : sync options} fields
     */
    GenericSync.register = function register(syncObject) {
        for (var key in syncObject){
            if (registry[key]){ // skip redundant registration
                if (registry[key] !== syncObject[key]) // only if same registered class
                    throw new Error('Conflicting sync classes for key: ' + key);
            }
            else registry[key] = syncObject[key];
        }
    };

    /**
     * Helper to set options on all sync instances
     *
     * @method setOptions
     * @param options {Object} options object
     */
    GenericSync.prototype.setOptions = function(options) {
        for (var key in this._syncs){
            this._syncs[key].setOptions(options);
        }
    };

    /**
     * Pipe events to a sync class
     *
     * @method pipeSync
     * @param key {String} identifier for sync class
     */
    GenericSync.prototype.pipeSync = function pipeToSync(key) {
        var sync = this._syncs[key];
        this._eventInput.pipe(sync);
        sync.pipe(this._eventOutput);
    };

    /**
     * Unpipe events from a sync class
     *
     * @method unpipeSync
     * @param key {String} identifier for sync class
     */
    GenericSync.prototype.unpipeSync = function unpipeFromSync(key) {
        var sync = this._syncs[key];
        this._eventInput.unpipe(sync);
        sync.unpipe(this._eventOutput);
    };

    function _addSingleSync(key, options) {
        if (!registry[key]) return;
        this._syncs[key] = new (registry[key])(options);
        this.pipeSync(key);
    }

    /**
     * Add a sync class to from the registered classes
     *
     * @method addSync
     * @param syncs {Object|Array.String} an array of registered sync keys
     *    or an object with fields {sync key : sync options}
     */
    GenericSync.prototype.addSync = function addSync(syncs) {
        if (syncs instanceof Array)
            for (var i = 0; i < syncs.length; i++)
                _addSingleSync.call(this, syncs[i]);
        else if (syncs instanceof Object)
            for (var key in syncs)
                _addSingleSync.call(this, key, syncs[key]);
    };

    module.exports = GenericSync;
});

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: felix@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define('famous/views/HeaderFooterLayout',['require','exports','module','../core/Entity','../core/RenderNode','../core/Transform','../core/OptionsManager'],function(require, exports, module) {
    var Entity = require('../core/Entity');
    var RenderNode = require('../core/RenderNode');
    var Transform = require('../core/Transform');
    var OptionsManager = require('../core/OptionsManager');

    /**
     * A layout which will arrange three renderables into a header and footer area of defined size,
      and a content area of flexible size.
     * @class HeaderFooterLayout
     * @constructor
     * @param {Options} [options] An object of configurable options.
     * @param {Number} [options.direction=HeaderFooterLayout.DIRECTION_Y] A direction of HeaderFooterLayout.DIRECTION_X
     * lays your HeaderFooterLayout instance horizontally, and a direction of HeaderFooterLayout.DIRECTION_Y
     * lays it out vertically.
     * @param {Number} [options.headerSize=undefined]  The amount of pixels allocated to the header node
     * in the HeaderFooterLayout instance's direction.
     * @param {Number} [options.footerSize=undefined] The amount of pixels allocated to the footer node
     * in the HeaderFooterLayout instance's direction.
     */
    function HeaderFooterLayout(options) {
        this.options = Object.create(HeaderFooterLayout.DEFAULT_OPTIONS);
        this._optionsManager = new OptionsManager(this.options);
        if (options) this.setOptions(options);

        this._entityId = Entity.register(this);

        this.header = new RenderNode();
        this.footer = new RenderNode();
        this.content = new RenderNode();
    }

    /**
     *  When used as a value for your HeaderFooterLayout's direction option, causes it to lay out horizontally.
     *
     *  @attribute DIRECTION_X
     *  @type Number
     *  @static
     *  @default 0
     *  @protected
     */
    HeaderFooterLayout.DIRECTION_X = 0;

    /**
     *  When used as a value for your HeaderFooterLayout's direction option, causes it to lay out vertically.
     *
     *  @attribute DIRECTION_Y
     *  @type Number
     *  @static
     *  @default 1
     *  @protected
     */
    HeaderFooterLayout.DIRECTION_Y = 1;

    HeaderFooterLayout.DEFAULT_OPTIONS = {
        direction: HeaderFooterLayout.DIRECTION_Y,
        headerSize: undefined,
        footerSize: undefined,
        defaultHeaderSize: 0,
        defaultFooterSize: 0
    };

    /**
     * Generate a render spec from the contents of this component.
     *
     * @private
     * @method render
     * @return {Object} Render spec for this component
     */
    HeaderFooterLayout.prototype.render = function render() {
        return this._entityId;
    };

    /**
     * Patches the HeaderFooterLayout instance's options with the passed-in ones.
     *
     * @method setOptions
     * @param {Options} options An object of configurable options for the HeaderFooterLayout instance.
     */
    HeaderFooterLayout.prototype.setOptions = function setOptions(options) {
        return this._optionsManager.setOptions(options);
    };

    function _resolveNodeSize(node, defaultSize) {
        var nodeSize = node.getSize();
        return nodeSize ? nodeSize[this.options.direction] : defaultSize;
    }

    function _outputTransform(offset) {
        if (this.options.direction === HeaderFooterLayout.DIRECTION_X) return Transform.translate(offset, 0, 0);
        else return Transform.translate(0, offset, 0);
    }

    function _finalSize(directionSize, size) {
        if (this.options.direction === HeaderFooterLayout.DIRECTION_X) return [directionSize, size[1]];
        else return [size[0], directionSize];
    }

    /**
     * Apply changes from this component to the corresponding document element.
     * This includes changes to classes, styles, size, content, opacity, origin,
     * and matrix transforms.
     *
     * @private
     * @method commit
     * @param {Context} context commit context
     */
    HeaderFooterLayout.prototype.commit = function commit(context) {
        var transform = context.transform;
        var origin = context.origin;
        var size = context.size;
        var opacity = context.opacity;

        var headerSize = (this.options.headerSize !== undefined) ? this.options.headerSize : _resolveNodeSize.call(this, this.header, this.options.defaultHeaderSize);
        var footerSize = (this.options.footerSize !== undefined) ? this.options.footerSize : _resolveNodeSize.call(this, this.footer, this.options.defaultFooterSize);
        var contentSize = size[this.options.direction] - headerSize - footerSize;

        if (size) transform = Transform.moveThen([-size[0]*origin[0], -size[1]*origin[1], 0], transform);

        var result = [
            {
                size: _finalSize.call(this, headerSize, size),
                target: this.header.render()
            },
            {
                transform: _outputTransform.call(this, headerSize),
                size: _finalSize.call(this, contentSize, size),
                target: this.content.render()
            },
            {
                transform: _outputTransform.call(this, headerSize + contentSize),
                size: _finalSize.call(this, footerSize, size),
                target: this.footer.render()
            }
        ];

        return {
            transform: transform,
            opacity: opacity,
            size: size,
            target: result
        };
    };

    module.exports = HeaderFooterLayout;
});

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: mark@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */
// TODO fix func-style
/*eslint func-style: [0, "declaration"] */

define('famous/utilities/Timer',['require','exports','module','../core/Engine'],function(require, exports, module) {
    /**
     * An internal library to reproduce javascript time-based scheduling.
     *   Using standard javascript setTimeout methods can have a negative performance impact
     *   when combined with the Famous rendering process, so instead require Timer and call
     *   Timer.setTimeout, Timer.setInterval, etc.
     *
     * @class Timer
     * @constructor
     */
    var FamousEngine = require('../core/Engine');

    var _event  = 'prerender';

    var getTime = (window.performance && window.performance.now) ?
        function() {
            return window.performance.now();
        }
        : function() {
            return Date.now();
        };

    /**
     * Add a function to be run on every prerender
     *
     * @method addTimerFunction
     *
     * @param {function} fn function to be run every prerender
     *
     * @return {function} function passed in as parameter
     */
    function addTimerFunction(fn) {
        FamousEngine.on(_event, fn);
        return fn;
    }

    /**
     * Wraps a function to be invoked after a certain amount of time.
     *  After a set duration has passed, it executes the function and
     *  removes it as a listener to 'prerender'.
     *
     * @method setTimeout
     *
     * @param {function} fn function to be run after a specified duration
     * @param {number} duration milliseconds from now to execute the function
     *
     * @return {function} function passed in as parameter
     */
    function setTimeout(fn, duration) {
        var t = getTime();
        var callback = function() {
            var t2 = getTime();
            if (t2 - t >= duration) {
                fn.apply(this, arguments);
                FamousEngine.removeListener(_event, callback);
            }
        };
        return addTimerFunction(callback);
    }

    /**
     * Wraps a function to be invoked after a certain amount of time.
     *  After a set duration has passed, it executes the function and
     *  resets the execution time.
     *
     * @method setInterval
     *
     * @param {function} fn function to be run after a specified duration
     * @param {number} duration interval to execute function in milliseconds
     *
     * @return {function} function passed in as parameter
     */
    function setInterval(fn, duration) {
        var t = getTime();
        var callback = function() {
            var t2 = getTime();
            if (t2 - t >= duration) {
                fn.apply(this, arguments);
                t = getTime();
            }
        };
        return addTimerFunction(callback);
    }

    /**
     * Wraps a function to be invoked after a certain amount of prerender ticks.
     *  Similar use to setTimeout but tied to the engine's run speed.
     *
     * @method after
     *
     * @param {function} fn function to be run after a specified amount of ticks
     * @param {number} numTicks number of prerender frames to wait
     *
     * @return {function} function passed in as parameter
     */
    function after(fn, numTicks) {
        if (numTicks === undefined) return undefined;
        var callback = function() {
            numTicks--;
            if (numTicks <= 0) { //in case numTicks is fraction or negative
                fn.apply(this, arguments);
                clear(callback);
            }
        };
        return addTimerFunction(callback);
    }

    /**
     * Wraps a function to be continually invoked after a certain amount of prerender ticks.
     *  Similar use to setInterval but tied to the engine's run speed.
     *
     * @method every
     *
     * @param {function} fn function to be run after a specified amount of ticks
     * @param {number} numTicks number of prerender frames to wait
     *
     * @return {function} function passed in as parameter
     */
    function every(fn, numTicks) {
        numTicks = numTicks || 1;
        var initial = numTicks;
        var callback = function() {
            numTicks--;
            if (numTicks <= 0) { //in case numTicks is fraction or negative
                fn.apply(this, arguments);
                numTicks = initial;
            }
        };
        return addTimerFunction(callback);
    }

    /**
     * Remove a function that gets called every prerender
     *
     * @method clear
     *
     * @param {function} fn event linstener
     */
    function clear(fn) {
        FamousEngine.removeListener(_event, fn);
    }

    /**
     * Executes a function after a certain amount of time. Makes sure
     *  the function is not run multiple times.
     *
     * @method debounce
     *
     * @param {function} func function to run after certain amount of time
     * @param {number} wait amount of time
     *
     * @return {function} function that is not able to debounce
     */
    function debounce(func, wait) {
        var timeout;
        var ctx;
        var timestamp;
        var result;
        var args;
        return function() {
            ctx = this;
            args = arguments;
            timestamp = getTime();

            var fn = function() {
                var last = getTime - timestamp;

                if (last < wait) {
                    timeout = setTimeout(fn, wait - last);
                } else {
                    timeout = null;
                    result = func.apply(ctx, args);
                }
            };

            clear(timeout);
            timeout = setTimeout(fn, wait);

            return result;
        };
    }

    module.exports = {
        setTimeout : setTimeout,
        setInterval : setInterval,
        debounce : debounce,
        after : after,
        every : every,
        clear : clear
    };

});

define('views/NavigationView',['require','exports','module','famous/core/Surface','famous/core/Modifier','famous/core/Transform','famous/core/EventHandler','famous/core/View'],function(require, exports, module) {
	var Surface = require('famous/core/Surface');
	var Modifier = require('famous/core/Modifier');
	var Transform = require('famous/core/Transform');
	var EventHandler = require('famous/core/EventHandler');
	var View = require('famous/core/View');

	function NavigationView() {
		View.apply(this, arguments);
		this.eventOutput = new EventHandler();
		EventHandler.setOutputHandler(this, this.eventOutput);

		_createIcon.call(this);
	}

	NavigationView.prototype = Object.create(View.prototype);
	NavigationView.prototype.constructor = NavigationView;

	NavigationView.DEFAULT_OPTIONS = {
		width: 1000,
		height: null,
		iconUrl: null,
		index: null
	};

	function _createIcon() {
		var that = this;
		var iconSurface = new Surface({
			content: '<img width="191" src="' + this.options.iconUrl + '"/>'
		});
		iconSurface.on('click', function() {
			that.eventOutput.emit('pageChange', that.options.index);
		})
		this._add(iconSurface);
	};

	module.exports = NavigationView;
});

define('views/MenuView',['require','exports','module','famous/core/Surface','famous/core/Modifier','famous/core/Transform','famous/core/View','famous/utilities/Timer','famous/core/EventHandler','./NavigationView'],function (require, exports, module) {
    var Surface = require('famous/core/Surface');
    var Modifier = require('famous/core/Modifier');
    var Transform = require('famous/core/Transform');
    var View = require('famous/core/View');
    var Timer = require('famous/utilities/Timer');

    var EventHandler = require('famous/core/EventHandler');
    var NavigationView = require('./NavigationView');

    function MenuView() {
        var that = this;
        View.apply(this, arguments);

        this.eventInput = new EventHandler();
        this.eventOutput = new EventHandler();
        EventHandler.setInputHandler(this, this.eventInput);
        EventHandler.setOutputHandler(this, this.eventOutput);

        this.eventInput.on('pageChange', function (index) {
            that.eventOutput.emit('navigateTo', index);

        })
        _createBacking.call(this);
        _createNavigationViews.call(this);
    }

    MenuView.prototype = Object.create(View.prototype);
    MenuView.prototype.constructor = MenuView;

    MenuView.prototype.resetNavItems = function () {
        for (var i = 0; i < this.navModifiers.length; i++) {
            var initX = -this.options.navWidth / 4;
            var initY = this.options.topOffset + this.options.navItemOffset * i + this.options.navHeight * 2;

            this.navModifiers[i].setOpacity(0.0);
            this.navModifiers[i].setTransform(Transform.translate(initX, initY, 0));
        }
    };

    MenuView.prototype.animateNavItems = function () {
        this.resetNavItems();

        for (var i = 0; i < this.navModifiers.length; i++) {
            // use Timer.setTimeout instead of window.setTimeout
            // Time can be found in famous/utilities

            Timer.setTimeout(function (i) {
                var yOffset = this.options.topOffset + this.options.navItemOffset * i;

                this.navModifiers[i].setOpacity(1, {duration: this.options.duration, curve: 'easeOut'});
                this.navModifiers[i].setTransform(
                    Transform.translate(0, yOffset, 0),
                    {duration: this.options.duration, curve: 'easeOut'});
            }.bind(this, i), i * this.options.staggerDelay);
        }
    };

    MenuView.DEFAULT_OPTIONS = {
        navWidth: 191,
        navHeight: 81,
        topOffset: 10,
        navItemOffset: 90,
        duration: 400,
        staggerDelay: 35
    };

    function _createBacking() {
        var backSurface = new Surface({
            size: [this.options.width, this.options.height],
            properties: {
                backgroundColor: '#595153'
            }
        });

        this._add(backSurface);
    }

    function _createNavigationViews() {
        this.navModifiers = [];

        var navData = [
            {iconUrl: 'img/nav-icons/home.png'},
            {iconUrl: 'img/nav-icons/about-us.png'},
            {iconUrl: 'img/nav-icons/demographics.png'},
            {iconUrl: 'img/nav-icons/clients.png'},
            {iconUrl: 'img/nav-icons/radio.png'},
            {iconUrl: 'img/nav-icons/contact-us.png'},
        ];

        for (var i = 0; i < navData.length; i++) {
            var navView = new NavigationView({
                width: this.options.navWidth,
                height: this.options.navHeight,
                iconUrl: navData[i].iconUrl,
                index: i
            });
            navView.pipe(this);

            var yOffset = this.options.topOffset + this.options.navItemOffset * i;

            var navModifier = new Modifier({
                transform: Transform.translate(0, yOffset, 0)
            });

            this.navModifiers.push(navModifier);
            this._add(navModifier).add(navView);
        }
    }

    module.exports = MenuView;
});

!function() {
  var d3 = {
    version: "3.5.3"
  };
  if (!Date.now) Date.now = function() {
    return +new Date();
  };
  var d3_arraySlice = [].slice, d3_array = function(list) {
    return d3_arraySlice.call(list);
  };
  var d3_document = document, d3_documentElement = d3_document.documentElement, d3_window = window;
  try {
    d3_array(d3_documentElement.childNodes)[0].nodeType;
  } catch (e) {
    d3_array = function(list) {
      var i = list.length, array = new Array(i);
      while (i--) array[i] = list[i];
      return array;
    };
  }
  try {
    d3_document.createElement("div").style.setProperty("opacity", 0, "");
  } catch (error) {
    var d3_element_prototype = d3_window.Element.prototype, d3_element_setAttribute = d3_element_prototype.setAttribute, d3_element_setAttributeNS = d3_element_prototype.setAttributeNS, d3_style_prototype = d3_window.CSSStyleDeclaration.prototype, d3_style_setProperty = d3_style_prototype.setProperty;
    d3_element_prototype.setAttribute = function(name, value) {
      d3_element_setAttribute.call(this, name, value + "");
    };
    d3_element_prototype.setAttributeNS = function(space, local, value) {
      d3_element_setAttributeNS.call(this, space, local, value + "");
    };
    d3_style_prototype.setProperty = function(name, value, priority) {
      d3_style_setProperty.call(this, name, value + "", priority);
    };
  }
  d3.ascending = d3_ascending;
  function d3_ascending(a, b) {
    return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
  }
  d3.descending = function(a, b) {
    return b < a ? -1 : b > a ? 1 : b >= a ? 0 : NaN;
  };
  d3.min = function(array, f) {
    var i = -1, n = array.length, a, b;
    if (arguments.length === 1) {
      while (++i < n) if ((b = array[i]) != null && b >= b) {
        a = b;
        break;
      }
      while (++i < n) if ((b = array[i]) != null && a > b) a = b;
    } else {
      while (++i < n) if ((b = f.call(array, array[i], i)) != null && b >= b) {
        a = b;
        break;
      }
      while (++i < n) if ((b = f.call(array, array[i], i)) != null && a > b) a = b;
    }
    return a;
  };
  d3.max = function(array, f) {
    var i = -1, n = array.length, a, b;
    if (arguments.length === 1) {
      while (++i < n) if ((b = array[i]) != null && b >= b) {
        a = b;
        break;
      }
      while (++i < n) if ((b = array[i]) != null && b > a) a = b;
    } else {
      while (++i < n) if ((b = f.call(array, array[i], i)) != null && b >= b) {
        a = b;
        break;
      }
      while (++i < n) if ((b = f.call(array, array[i], i)) != null && b > a) a = b;
    }
    return a;
  };
  d3.extent = function(array, f) {
    var i = -1, n = array.length, a, b, c;
    if (arguments.length === 1) {
      while (++i < n) if ((b = array[i]) != null && b >= b) {
        a = c = b;
        break;
      }
      while (++i < n) if ((b = array[i]) != null) {
        if (a > b) a = b;
        if (c < b) c = b;
      }
    } else {
      while (++i < n) if ((b = f.call(array, array[i], i)) != null && b >= b) {
        a = c = b;
        break;
      }
      while (++i < n) if ((b = f.call(array, array[i], i)) != null) {
        if (a > b) a = b;
        if (c < b) c = b;
      }
    }
    return [ a, c ];
  };
  function d3_number(x) {
    return x === null ? NaN : +x;
  }
  function d3_numeric(x) {
    return !isNaN(x);
  }
  d3.sum = function(array, f) {
    var s = 0, n = array.length, a, i = -1;
    if (arguments.length === 1) {
      while (++i < n) if (d3_numeric(a = +array[i])) s += a;
    } else {
      while (++i < n) if (d3_numeric(a = +f.call(array, array[i], i))) s += a;
    }
    return s;
  };
  d3.mean = function(array, f) {
    var s = 0, n = array.length, a, i = -1, j = n;
    if (arguments.length === 1) {
      while (++i < n) if (d3_numeric(a = d3_number(array[i]))) s += a; else --j;
    } else {
      while (++i < n) if (d3_numeric(a = d3_number(f.call(array, array[i], i)))) s += a; else --j;
    }
    if (j) return s / j;
  };
  d3.quantile = function(values, p) {
    var H = (values.length - 1) * p + 1, h = Math.floor(H), v = +values[h - 1], e = H - h;
    return e ? v + e * (values[h] - v) : v;
  };
  d3.median = function(array, f) {
    var numbers = [], n = array.length, a, i = -1;
    if (arguments.length === 1) {
      while (++i < n) if (d3_numeric(a = d3_number(array[i]))) numbers.push(a);
    } else {
      while (++i < n) if (d3_numeric(a = d3_number(f.call(array, array[i], i)))) numbers.push(a);
    }
    if (numbers.length) return d3.quantile(numbers.sort(d3_ascending), .5);
  };
  d3.variance = function(array, f) {
    var n = array.length, m = 0, a, d, s = 0, i = -1, j = 0;
    if (arguments.length === 1) {
      while (++i < n) {
        if (d3_numeric(a = d3_number(array[i]))) {
          d = a - m;
          m += d / ++j;
          s += d * (a - m);
        }
      }
    } else {
      while (++i < n) {
        if (d3_numeric(a = d3_number(f.call(array, array[i], i)))) {
          d = a - m;
          m += d / ++j;
          s += d * (a - m);
        }
      }
    }
    if (j > 1) return s / (j - 1);
  };
  d3.deviation = function() {
    var v = d3.variance.apply(this, arguments);
    return v ? Math.sqrt(v) : v;
  };
  function d3_bisector(compare) {
    return {
      left: function(a, x, lo, hi) {
        if (arguments.length < 3) lo = 0;
        if (arguments.length < 4) hi = a.length;
        while (lo < hi) {
          var mid = lo + hi >>> 1;
          if (compare(a[mid], x) < 0) lo = mid + 1; else hi = mid;
        }
        return lo;
      },
      right: function(a, x, lo, hi) {
        if (arguments.length < 3) lo = 0;
        if (arguments.length < 4) hi = a.length;
        while (lo < hi) {
          var mid = lo + hi >>> 1;
          if (compare(a[mid], x) > 0) hi = mid; else lo = mid + 1;
        }
        return lo;
      }
    };
  }
  var d3_bisect = d3_bisector(d3_ascending);
  d3.bisectLeft = d3_bisect.left;
  d3.bisect = d3.bisectRight = d3_bisect.right;
  d3.bisector = function(f) {
    return d3_bisector(f.length === 1 ? function(d, x) {
      return d3_ascending(f(d), x);
    } : f);
  };
  d3.shuffle = function(array, i0, i1) {
    if ((m = arguments.length) < 3) {
      i1 = array.length;
      if (m < 2) i0 = 0;
    }
    var m = i1 - i0, t, i;
    while (m) {
      i = Math.random() * m-- | 0;
      t = array[m + i0], array[m + i0] = array[i + i0], array[i + i0] = t;
    }
    return array;
  };
  d3.permute = function(array, indexes) {
    var i = indexes.length, permutes = new Array(i);
    while (i--) permutes[i] = array[indexes[i]];
    return permutes;
  };
  d3.pairs = function(array) {
    var i = 0, n = array.length - 1, p0, p1 = array[0], pairs = new Array(n < 0 ? 0 : n);
    while (i < n) pairs[i] = [ p0 = p1, p1 = array[++i] ];
    return pairs;
  };
  d3.zip = function() {
    if (!(n = arguments.length)) return [];
    for (var i = -1, m = d3.min(arguments, d3_zipLength), zips = new Array(m); ++i < m; ) {
      for (var j = -1, n, zip = zips[i] = new Array(n); ++j < n; ) {
        zip[j] = arguments[j][i];
      }
    }
    return zips;
  };
  function d3_zipLength(d) {
    return d.length;
  }
  d3.transpose = function(matrix) {
    return d3.zip.apply(d3, matrix);
  };
  d3.keys = function(map) {
    var keys = [];
    for (var key in map) keys.push(key);
    return keys;
  };
  d3.values = function(map) {
    var values = [];
    for (var key in map) values.push(map[key]);
    return values;
  };
  d3.entries = function(map) {
    var entries = [];
    for (var key in map) entries.push({
      key: key,
      value: map[key]
    });
    return entries;
  };
  d3.merge = function(arrays) {
    var n = arrays.length, m, i = -1, j = 0, merged, array;
    while (++i < n) j += arrays[i].length;
    merged = new Array(j);
    while (--n >= 0) {
      array = arrays[n];
      m = array.length;
      while (--m >= 0) {
        merged[--j] = array[m];
      }
    }
    return merged;
  };
  var abs = Math.abs;
  d3.range = function(start, stop, step) {
    if (arguments.length < 3) {
      step = 1;
      if (arguments.length < 2) {
        stop = start;
        start = 0;
      }
    }
    if ((stop - start) / step === Infinity) throw new Error("infinite range");
    var range = [], k = d3_range_integerScale(abs(step)), i = -1, j;
    start *= k, stop *= k, step *= k;
    if (step < 0) while ((j = start + step * ++i) > stop) range.push(j / k); else while ((j = start + step * ++i) < stop) range.push(j / k);
    return range;
  };
  function d3_range_integerScale(x) {
    var k = 1;
    while (x * k % 1) k *= 10;
    return k;
  }
  function d3_class(ctor, properties) {
    for (var key in properties) {
      Object.defineProperty(ctor.prototype, key, {
        value: properties[key],
        enumerable: false
      });
    }
  }
  d3.map = function(object, f) {
    var map = new d3_Map();
    if (object instanceof d3_Map) {
      object.forEach(function(key, value) {
        map.set(key, value);
      });
    } else if (Array.isArray(object)) {
      var i = -1, n = object.length, o;
      if (arguments.length === 1) while (++i < n) map.set(i, object[i]); else while (++i < n) map.set(f.call(object, o = object[i], i), o);
    } else {
      for (var key in object) map.set(key, object[key]);
    }
    return map;
  };
  function d3_Map() {
    this._ = Object.create(null);
  }
  var d3_map_proto = "__proto__", d3_map_zero = "\x00";
  d3_class(d3_Map, {
    has: d3_map_has,
    get: function(key) {
      return this._[d3_map_escape(key)];
    },
    set: function(key, value) {
      return this._[d3_map_escape(key)] = value;
    },
    remove: d3_map_remove,
    keys: d3_map_keys,
    values: function() {
      var values = [];
      for (var key in this._) values.push(this._[key]);
      return values;
    },
    entries: function() {
      var entries = [];
      for (var key in this._) entries.push({
        key: d3_map_unescape(key),
        value: this._[key]
      });
      return entries;
    },
    size: d3_map_size,
    empty: d3_map_empty,
    forEach: function(f) {
      for (var key in this._) f.call(this, d3_map_unescape(key), this._[key]);
    }
  });
  function d3_map_escape(key) {
    return (key += "") === d3_map_proto || key[0] === d3_map_zero ? d3_map_zero + key : key;
  }
  function d3_map_unescape(key) {
    return (key += "")[0] === d3_map_zero ? key.slice(1) : key;
  }
  function d3_map_has(key) {
    return d3_map_escape(key) in this._;
  }
  function d3_map_remove(key) {
    return (key = d3_map_escape(key)) in this._ && delete this._[key];
  }
  function d3_map_keys() {
    var keys = [];
    for (var key in this._) keys.push(d3_map_unescape(key));
    return keys;
  }
  function d3_map_size() {
    var size = 0;
    for (var key in this._) ++size;
    return size;
  }
  function d3_map_empty() {
    for (var key in this._) return false;
    return true;
  }
  d3.nest = function() {
    var nest = {}, keys = [], sortKeys = [], sortValues, rollup;
    function map(mapType, array, depth) {
      if (depth >= keys.length) return rollup ? rollup.call(nest, array) : sortValues ? array.sort(sortValues) : array;
      var i = -1, n = array.length, key = keys[depth++], keyValue, object, setter, valuesByKey = new d3_Map(), values;
      while (++i < n) {
        if (values = valuesByKey.get(keyValue = key(object = array[i]))) {
          values.push(object);
        } else {
          valuesByKey.set(keyValue, [ object ]);
        }
      }
      if (mapType) {
        object = mapType();
        setter = function(keyValue, values) {
          object.set(keyValue, map(mapType, values, depth));
        };
      } else {
        object = {};
        setter = function(keyValue, values) {
          object[keyValue] = map(mapType, values, depth);
        };
      }
      valuesByKey.forEach(setter);
      return object;
    }
    function entries(map, depth) {
      if (depth >= keys.length) return map;
      var array = [], sortKey = sortKeys[depth++];
      map.forEach(function(key, keyMap) {
        array.push({
          key: key,
          values: entries(keyMap, depth)
        });
      });
      return sortKey ? array.sort(function(a, b) {
        return sortKey(a.key, b.key);
      }) : array;
    }
    nest.map = function(array, mapType) {
      return map(mapType, array, 0);
    };
    nest.entries = function(array) {
      return entries(map(d3.map, array, 0), 0);
    };
    nest.key = function(d) {
      keys.push(d);
      return nest;
    };
    nest.sortKeys = function(order) {
      sortKeys[keys.length - 1] = order;
      return nest;
    };
    nest.sortValues = function(order) {
      sortValues = order;
      return nest;
    };
    nest.rollup = function(f) {
      rollup = f;
      return nest;
    };
    return nest;
  };
  d3.set = function(array) {
    var set = new d3_Set();
    if (array) for (var i = 0, n = array.length; i < n; ++i) set.add(array[i]);
    return set;
  };
  function d3_Set() {
    this._ = Object.create(null);
  }
  d3_class(d3_Set, {
    has: d3_map_has,
    add: function(key) {
      this._[d3_map_escape(key += "")] = true;
      return key;
    },
    remove: d3_map_remove,
    values: d3_map_keys,
    size: d3_map_size,
    empty: d3_map_empty,
    forEach: function(f) {
      for (var key in this._) f.call(this, d3_map_unescape(key));
    }
  });
  d3.behavior = {};
  d3.rebind = function(target, source) {
    var i = 1, n = arguments.length, method;
    while (++i < n) target[method = arguments[i]] = d3_rebind(target, source, source[method]);
    return target;
  };
  function d3_rebind(target, source, method) {
    return function() {
      var value = method.apply(source, arguments);
      return value === source ? target : value;
    };
  }
  function d3_vendorSymbol(object, name) {
    if (name in object) return name;
    name = name.charAt(0).toUpperCase() + name.slice(1);
    for (var i = 0, n = d3_vendorPrefixes.length; i < n; ++i) {
      var prefixName = d3_vendorPrefixes[i] + name;
      if (prefixName in object) return prefixName;
    }
  }
  var d3_vendorPrefixes = [ "webkit", "ms", "moz", "Moz", "o", "O" ];
  function d3_noop() {}
  d3.dispatch = function() {
    var dispatch = new d3_dispatch(), i = -1, n = arguments.length;
    while (++i < n) dispatch[arguments[i]] = d3_dispatch_event(dispatch);
    return dispatch;
  };
  function d3_dispatch() {}
  d3_dispatch.prototype.on = function(type, listener) {
    var i = type.indexOf("."), name = "";
    if (i >= 0) {
      name = type.slice(i + 1);
      type = type.slice(0, i);
    }
    if (type) return arguments.length < 2 ? this[type].on(name) : this[type].on(name, listener);
    if (arguments.length === 2) {
      if (listener == null) for (type in this) {
        if (this.hasOwnProperty(type)) this[type].on(name, null);
      }
      return this;
    }
  };
  function d3_dispatch_event(dispatch) {
    var listeners = [], listenerByName = new d3_Map();
    function event() {
      var z = listeners, i = -1, n = z.length, l;
      while (++i < n) if (l = z[i].on) l.apply(this, arguments);
      return dispatch;
    }
    event.on = function(name, listener) {
      var l = listenerByName.get(name), i;
      if (arguments.length < 2) return l && l.on;
      if (l) {
        l.on = null;
        listeners = listeners.slice(0, i = listeners.indexOf(l)).concat(listeners.slice(i + 1));
        listenerByName.remove(name);
      }
      if (listener) listeners.push(listenerByName.set(name, {
        on: listener
      }));
      return dispatch;
    };
    return event;
  }
  d3.event = null;
  function d3_eventPreventDefault() {
    d3.event.preventDefault();
  }
  function d3_eventSource() {
    var e = d3.event, s;
    while (s = e.sourceEvent) e = s;
    return e;
  }
  function d3_eventDispatch(target) {
    var dispatch = new d3_dispatch(), i = 0, n = arguments.length;
    while (++i < n) dispatch[arguments[i]] = d3_dispatch_event(dispatch);
    dispatch.of = function(thiz, argumentz) {
      return function(e1) {
        try {
          var e0 = e1.sourceEvent = d3.event;
          e1.target = target;
          d3.event = e1;
          dispatch[e1.type].apply(thiz, argumentz);
        } finally {
          d3.event = e0;
        }
      };
    };
    return dispatch;
  }
  d3.requote = function(s) {
    return s.replace(d3_requote_re, "\\$&");
  };
  var d3_requote_re = /[\\\^\$\*\+\?\|\[\]\(\)\.\{\}]/g;
  var d3_subclass = {}.__proto__ ? function(object, prototype) {
    object.__proto__ = prototype;
  } : function(object, prototype) {
    for (var property in prototype) object[property] = prototype[property];
  };
  function d3_selection(groups) {
    d3_subclass(groups, d3_selectionPrototype);
    return groups;
  }
  var d3_select = function(s, n) {
    return n.querySelector(s);
  }, d3_selectAll = function(s, n) {
    return n.querySelectorAll(s);
  }, d3_selectMatcher = d3_documentElement.matches || d3_documentElement[d3_vendorSymbol(d3_documentElement, "matchesSelector")], d3_selectMatches = function(n, s) {
    return d3_selectMatcher.call(n, s);
  };
  if (typeof Sizzle === "function") {
    d3_select = function(s, n) {
      return Sizzle(s, n)[0] || null;
    };
    d3_selectAll = Sizzle;
    d3_selectMatches = Sizzle.matchesSelector;
  }
  d3.selection = function() {
    return d3_selectionRoot;
  };
  var d3_selectionPrototype = d3.selection.prototype = [];
  d3_selectionPrototype.select = function(selector) {
    var subgroups = [], subgroup, subnode, group, node;
    selector = d3_selection_selector(selector);
    for (var j = -1, m = this.length; ++j < m; ) {
      subgroups.push(subgroup = []);
      subgroup.parentNode = (group = this[j]).parentNode;
      for (var i = -1, n = group.length; ++i < n; ) {
        if (node = group[i]) {
          subgroup.push(subnode = selector.call(node, node.__data__, i, j));
          if (subnode && "__data__" in node) subnode.__data__ = node.__data__;
        } else {
          subgroup.push(null);
        }
      }
    }
    return d3_selection(subgroups);
  };
  function d3_selection_selector(selector) {
    return typeof selector === "function" ? selector : function() {
      return d3_select(selector, this);
    };
  }
  d3_selectionPrototype.selectAll = function(selector) {
    var subgroups = [], subgroup, node;
    selector = d3_selection_selectorAll(selector);
    for (var j = -1, m = this.length; ++j < m; ) {
      for (var group = this[j], i = -1, n = group.length; ++i < n; ) {
        if (node = group[i]) {
          subgroups.push(subgroup = d3_array(selector.call(node, node.__data__, i, j)));
          subgroup.parentNode = node;
        }
      }
    }
    return d3_selection(subgroups);
  };
  function d3_selection_selectorAll(selector) {
    return typeof selector === "function" ? selector : function() {
      return d3_selectAll(selector, this);
    };
  }
  var d3_nsPrefix = {
    svg: "http://www.w3.org/2000/svg",
    xhtml: "http://www.w3.org/1999/xhtml",
    xlink: "http://www.w3.org/1999/xlink",
    xml: "http://www.w3.org/XML/1998/namespace",
    xmlns: "http://www.w3.org/2000/xmlns/"
  };
  d3.ns = {
    prefix: d3_nsPrefix,
    qualify: function(name) {
      var i = name.indexOf(":"), prefix = name;
      if (i >= 0) {
        prefix = name.slice(0, i);
        name = name.slice(i + 1);
      }
      return d3_nsPrefix.hasOwnProperty(prefix) ? {
        space: d3_nsPrefix[prefix],
        local: name
      } : name;
    }
  };
  d3_selectionPrototype.attr = function(name, value) {
    if (arguments.length < 2) {
      if (typeof name === "string") {
        var node = this.node();
        name = d3.ns.qualify(name);
        return name.local ? node.getAttributeNS(name.space, name.local) : node.getAttribute(name);
      }
      for (value in name) this.each(d3_selection_attr(value, name[value]));
      return this;
    }
    return this.each(d3_selection_attr(name, value));
  };
  function d3_selection_attr(name, value) {
    name = d3.ns.qualify(name);
    function attrNull() {
      this.removeAttribute(name);
    }
    function attrNullNS() {
      this.removeAttributeNS(name.space, name.local);
    }
    function attrConstant() {
      this.setAttribute(name, value);
    }
    function attrConstantNS() {
      this.setAttributeNS(name.space, name.local, value);
    }
    function attrFunction() {
      var x = value.apply(this, arguments);
      if (x == null) this.removeAttribute(name); else this.setAttribute(name, x);
    }
    function attrFunctionNS() {
      var x = value.apply(this, arguments);
      if (x == null) this.removeAttributeNS(name.space, name.local); else this.setAttributeNS(name.space, name.local, x);
    }
    return value == null ? name.local ? attrNullNS : attrNull : typeof value === "function" ? name.local ? attrFunctionNS : attrFunction : name.local ? attrConstantNS : attrConstant;
  }
  function d3_collapse(s) {
    return s.trim().replace(/\s+/g, " ");
  }
  d3_selectionPrototype.classed = function(name, value) {
    if (arguments.length < 2) {
      if (typeof name === "string") {
        var node = this.node(), n = (name = d3_selection_classes(name)).length, i = -1;
        if (value = node.classList) {
          while (++i < n) if (!value.contains(name[i])) return false;
        } else {
          value = node.getAttribute("class");
          while (++i < n) if (!d3_selection_classedRe(name[i]).test(value)) return false;
        }
        return true;
      }
      for (value in name) this.each(d3_selection_classed(value, name[value]));
      return this;
    }
    return this.each(d3_selection_classed(name, value));
  };
  function d3_selection_classedRe(name) {
    return new RegExp("(?:^|\\s+)" + d3.requote(name) + "(?:\\s+|$)", "g");
  }
  function d3_selection_classes(name) {
    return (name + "").trim().split(/^|\s+/);
  }
  function d3_selection_classed(name, value) {
    name = d3_selection_classes(name).map(d3_selection_classedName);
    var n = name.length;
    function classedConstant() {
      var i = -1;
      while (++i < n) name[i](this, value);
    }
    function classedFunction() {
      var i = -1, x = value.apply(this, arguments);
      while (++i < n) name[i](this, x);
    }
    return typeof value === "function" ? classedFunction : classedConstant;
  }
  function d3_selection_classedName(name) {
    var re = d3_selection_classedRe(name);
    return function(node, value) {
      if (c = node.classList) return value ? c.add(name) : c.remove(name);
      var c = node.getAttribute("class") || "";
      if (value) {
        re.lastIndex = 0;
        if (!re.test(c)) node.setAttribute("class", d3_collapse(c + " " + name));
      } else {
        node.setAttribute("class", d3_collapse(c.replace(re, " ")));
      }
    };
  }
  d3_selectionPrototype.style = function(name, value, priority) {
    var n = arguments.length;
    if (n < 3) {
      if (typeof name !== "string") {
        if (n < 2) value = "";
        for (priority in name) this.each(d3_selection_style(priority, name[priority], value));
        return this;
      }
      if (n < 2) return d3_window.getComputedStyle(this.node(), null).getPropertyValue(name);
      priority = "";
    }
    return this.each(d3_selection_style(name, value, priority));
  };
  function d3_selection_style(name, value, priority) {
    function styleNull() {
      this.style.removeProperty(name);
    }
    function styleConstant() {
      this.style.setProperty(name, value, priority);
    }
    function styleFunction() {
      var x = value.apply(this, arguments);
      if (x == null) this.style.removeProperty(name); else this.style.setProperty(name, x, priority);
    }
    return value == null ? styleNull : typeof value === "function" ? styleFunction : styleConstant;
  }
  d3_selectionPrototype.property = function(name, value) {
    if (arguments.length < 2) {
      if (typeof name === "string") return this.node()[name];
      for (value in name) this.each(d3_selection_property(value, name[value]));
      return this;
    }
    return this.each(d3_selection_property(name, value));
  };
  function d3_selection_property(name, value) {
    function propertyNull() {
      delete this[name];
    }
    function propertyConstant() {
      this[name] = value;
    }
    function propertyFunction() {
      var x = value.apply(this, arguments);
      if (x == null) delete this[name]; else this[name] = x;
    }
    return value == null ? propertyNull : typeof value === "function" ? propertyFunction : propertyConstant;
  }
  d3_selectionPrototype.text = function(value) {
    return arguments.length ? this.each(typeof value === "function" ? function() {
      var v = value.apply(this, arguments);
      this.textContent = v == null ? "" : v;
    } : value == null ? function() {
      this.textContent = "";
    } : function() {
      this.textContent = value;
    }) : this.node().textContent;
  };
  d3_selectionPrototype.html = function(value) {
    return arguments.length ? this.each(typeof value === "function" ? function() {
      var v = value.apply(this, arguments);
      this.innerHTML = v == null ? "" : v;
    } : value == null ? function() {
      this.innerHTML = "";
    } : function() {
      this.innerHTML = value;
    }) : this.node().innerHTML;
  };
  d3_selectionPrototype.append = function(name) {
    name = d3_selection_creator(name);
    return this.select(function() {
      return this.appendChild(name.apply(this, arguments));
    });
  };
  function d3_selection_creator(name) {
    return typeof name === "function" ? name : (name = d3.ns.qualify(name)).local ? function() {
      return this.ownerDocument.createElementNS(name.space, name.local);
    } : function() {
      return this.ownerDocument.createElementNS(this.namespaceURI, name);
    };
  }
  d3_selectionPrototype.insert = function(name, before) {
    name = d3_selection_creator(name);
    before = d3_selection_selector(before);
    return this.select(function() {
      return this.insertBefore(name.apply(this, arguments), before.apply(this, arguments) || null);
    });
  };
  d3_selectionPrototype.remove = function() {
    return this.each(d3_selectionRemove);
  };
  function d3_selectionRemove() {
    var parent = this.parentNode;
    if (parent) parent.removeChild(this);
  }
  d3_selectionPrototype.data = function(value, key) {
    var i = -1, n = this.length, group, node;
    if (!arguments.length) {
      value = new Array(n = (group = this[0]).length);
      while (++i < n) {
        if (node = group[i]) {
          value[i] = node.__data__;
        }
      }
      return value;
    }
    function bind(group, groupData) {
      var i, n = group.length, m = groupData.length, n0 = Math.min(n, m), updateNodes = new Array(m), enterNodes = new Array(m), exitNodes = new Array(n), node, nodeData;
      if (key) {
        var nodeByKeyValue = new d3_Map(), keyValues = new Array(n), keyValue;
        for (i = -1; ++i < n; ) {
          if (nodeByKeyValue.has(keyValue = key.call(node = group[i], node.__data__, i))) {
            exitNodes[i] = node;
          } else {
            nodeByKeyValue.set(keyValue, node);
          }
          keyValues[i] = keyValue;
        }
        for (i = -1; ++i < m; ) {
          if (!(node = nodeByKeyValue.get(keyValue = key.call(groupData, nodeData = groupData[i], i)))) {
            enterNodes[i] = d3_selection_dataNode(nodeData);
          } else if (node !== true) {
            updateNodes[i] = node;
            node.__data__ = nodeData;
          }
          nodeByKeyValue.set(keyValue, true);
        }
        for (i = -1; ++i < n; ) {
          if (nodeByKeyValue.get(keyValues[i]) !== true) {
            exitNodes[i] = group[i];
          }
        }
      } else {
        for (i = -1; ++i < n0; ) {
          node = group[i];
          nodeData = groupData[i];
          if (node) {
            node.__data__ = nodeData;
            updateNodes[i] = node;
          } else {
            enterNodes[i] = d3_selection_dataNode(nodeData);
          }
        }
        for (;i < m; ++i) {
          enterNodes[i] = d3_selection_dataNode(groupData[i]);
        }
        for (;i < n; ++i) {
          exitNodes[i] = group[i];
        }
      }
      enterNodes.update = updateNodes;
      enterNodes.parentNode = updateNodes.parentNode = exitNodes.parentNode = group.parentNode;
      enter.push(enterNodes);
      update.push(updateNodes);
      exit.push(exitNodes);
    }
    var enter = d3_selection_enter([]), update = d3_selection([]), exit = d3_selection([]);
    if (typeof value === "function") {
      while (++i < n) {
        bind(group = this[i], value.call(group, group.parentNode.__data__, i));
      }
    } else {
      while (++i < n) {
        bind(group = this[i], value);
      }
    }
    update.enter = function() {
      return enter;
    };
    update.exit = function() {
      return exit;
    };
    return update;
  };
  function d3_selection_dataNode(data) {
    return {
      __data__: data
    };
  }
  d3_selectionPrototype.datum = function(value) {
    return arguments.length ? this.property("__data__", value) : this.property("__data__");
  };
  d3_selectionPrototype.filter = function(filter) {
    var subgroups = [], subgroup, group, node;
    if (typeof filter !== "function") filter = d3_selection_filter(filter);
    for (var j = 0, m = this.length; j < m; j++) {
      subgroups.push(subgroup = []);
      subgroup.parentNode = (group = this[j]).parentNode;
      for (var i = 0, n = group.length; i < n; i++) {
        if ((node = group[i]) && filter.call(node, node.__data__, i, j)) {
          subgroup.push(node);
        }
      }
    }
    return d3_selection(subgroups);
  };
  function d3_selection_filter(selector) {
    return function() {
      return d3_selectMatches(this, selector);
    };
  }
  d3_selectionPrototype.order = function() {
    for (var j = -1, m = this.length; ++j < m; ) {
      for (var group = this[j], i = group.length - 1, next = group[i], node; --i >= 0; ) {
        if (node = group[i]) {
          if (next && next !== node.nextSibling) next.parentNode.insertBefore(node, next);
          next = node;
        }
      }
    }
    return this;
  };
  d3_selectionPrototype.sort = function(comparator) {
    comparator = d3_selection_sortComparator.apply(this, arguments);
    for (var j = -1, m = this.length; ++j < m; ) this[j].sort(comparator);
    return this.order();
  };
  function d3_selection_sortComparator(comparator) {
    if (!arguments.length) comparator = d3_ascending;
    return function(a, b) {
      return a && b ? comparator(a.__data__, b.__data__) : !a - !b;
    };
  }
  d3_selectionPrototype.each = function(callback) {
    return d3_selection_each(this, function(node, i, j) {
      callback.call(node, node.__data__, i, j);
    });
  };
  function d3_selection_each(groups, callback) {
    for (var j = 0, m = groups.length; j < m; j++) {
      for (var group = groups[j], i = 0, n = group.length, node; i < n; i++) {
        if (node = group[i]) callback(node, i, j);
      }
    }
    return groups;
  }
  d3_selectionPrototype.call = function(callback) {
    var args = d3_array(arguments);
    callback.apply(args[0] = this, args);
    return this;
  };
  d3_selectionPrototype.empty = function() {
    return !this.node();
  };
  d3_selectionPrototype.node = function() {
    for (var j = 0, m = this.length; j < m; j++) {
      for (var group = this[j], i = 0, n = group.length; i < n; i++) {
        var node = group[i];
        if (node) return node;
      }
    }
    return null;
  };
  d3_selectionPrototype.size = function() {
    var n = 0;
    d3_selection_each(this, function() {
      ++n;
    });
    return n;
  };
  function d3_selection_enter(selection) {
    d3_subclass(selection, d3_selection_enterPrototype);
    return selection;
  }
  var d3_selection_enterPrototype = [];
  d3.selection.enter = d3_selection_enter;
  d3.selection.enter.prototype = d3_selection_enterPrototype;
  d3_selection_enterPrototype.append = d3_selectionPrototype.append;
  d3_selection_enterPrototype.empty = d3_selectionPrototype.empty;
  d3_selection_enterPrototype.node = d3_selectionPrototype.node;
  d3_selection_enterPrototype.call = d3_selectionPrototype.call;
  d3_selection_enterPrototype.size = d3_selectionPrototype.size;
  d3_selection_enterPrototype.select = function(selector) {
    var subgroups = [], subgroup, subnode, upgroup, group, node;
    for (var j = -1, m = this.length; ++j < m; ) {
      upgroup = (group = this[j]).update;
      subgroups.push(subgroup = []);
      subgroup.parentNode = group.parentNode;
      for (var i = -1, n = group.length; ++i < n; ) {
        if (node = group[i]) {
          subgroup.push(upgroup[i] = subnode = selector.call(group.parentNode, node.__data__, i, j));
          subnode.__data__ = node.__data__;
        } else {
          subgroup.push(null);
        }
      }
    }
    return d3_selection(subgroups);
  };
  d3_selection_enterPrototype.insert = function(name, before) {
    if (arguments.length < 2) before = d3_selection_enterInsertBefore(this);
    return d3_selectionPrototype.insert.call(this, name, before);
  };
  function d3_selection_enterInsertBefore(enter) {
    var i0, j0;
    return function(d, i, j) {
      var group = enter[j].update, n = group.length, node;
      if (j != j0) j0 = j, i0 = 0;
      if (i >= i0) i0 = i + 1;
      while (!(node = group[i0]) && ++i0 < n) ;
      return node;
    };
  }
  d3.select = function(node) {
    var group = [ typeof node === "string" ? d3_select(node, d3_document) : node ];
    group.parentNode = d3_documentElement;
    return d3_selection([ group ]);
  };
  d3.selectAll = function(nodes) {
    var group = d3_array(typeof nodes === "string" ? d3_selectAll(nodes, d3_document) : nodes);
    group.parentNode = d3_documentElement;
    return d3_selection([ group ]);
  };
  var d3_selectionRoot = d3.select(d3_documentElement);
  d3_selectionPrototype.on = function(type, listener, capture) {
    var n = arguments.length;
    if (n < 3) {
      if (typeof type !== "string") {
        if (n < 2) listener = false;
        for (capture in type) this.each(d3_selection_on(capture, type[capture], listener));
        return this;
      }
      if (n < 2) return (n = this.node()["__on" + type]) && n._;
      capture = false;
    }
    return this.each(d3_selection_on(type, listener, capture));
  };
  function d3_selection_on(type, listener, capture) {
    var name = "__on" + type, i = type.indexOf("."), wrap = d3_selection_onListener;
    if (i > 0) type = type.slice(0, i);
    var filter = d3_selection_onFilters.get(type);
    if (filter) type = filter, wrap = d3_selection_onFilter;
    function onRemove() {
      var l = this[name];
      if (l) {
        this.removeEventListener(type, l, l.$);
        delete this[name];
      }
    }
    function onAdd() {
      var l = wrap(listener, d3_array(arguments));
      onRemove.call(this);
      this.addEventListener(type, this[name] = l, l.$ = capture);
      l._ = listener;
    }
    function removeAll() {
      var re = new RegExp("^__on([^.]+)" + d3.requote(type) + "$"), match;
      for (var name in this) {
        if (match = name.match(re)) {
          var l = this[name];
          this.removeEventListener(match[1], l, l.$);
          delete this[name];
        }
      }
    }
    return i ? listener ? onAdd : onRemove : listener ? d3_noop : removeAll;
  }
  var d3_selection_onFilters = d3.map({
    mouseenter: "mouseover",
    mouseleave: "mouseout"
  });
  d3_selection_onFilters.forEach(function(k) {
    if ("on" + k in d3_document) d3_selection_onFilters.remove(k);
  });
  function d3_selection_onListener(listener, argumentz) {
    return function(e) {
      var o = d3.event;
      d3.event = e;
      argumentz[0] = this.__data__;
      try {
        listener.apply(this, argumentz);
      } finally {
        d3.event = o;
      }
    };
  }
  function d3_selection_onFilter(listener, argumentz) {
    var l = d3_selection_onListener(listener, argumentz);
    return function(e) {
      var target = this, related = e.relatedTarget;
      if (!related || related !== target && !(related.compareDocumentPosition(target) & 8)) {
        l.call(target, e);
      }
    };
  }
  var d3_event_dragSelect = "onselectstart" in d3_document ? null : d3_vendorSymbol(d3_documentElement.style, "userSelect"), d3_event_dragId = 0;
  function d3_event_dragSuppress() {
    var name = ".dragsuppress-" + ++d3_event_dragId, click = "click" + name, w = d3.select(d3_window).on("touchmove" + name, d3_eventPreventDefault).on("dragstart" + name, d3_eventPreventDefault).on("selectstart" + name, d3_eventPreventDefault);
    if (d3_event_dragSelect) {
      var style = d3_documentElement.style, select = style[d3_event_dragSelect];
      style[d3_event_dragSelect] = "none";
    }
    return function(suppressClick) {
      w.on(name, null);
      if (d3_event_dragSelect) style[d3_event_dragSelect] = select;
      if (suppressClick) {
        var off = function() {
          w.on(click, null);
        };
        w.on(click, function() {
          d3_eventPreventDefault();
          off();
        }, true);
        setTimeout(off, 0);
      }
    };
  }
  d3.mouse = function(container) {
    return d3_mousePoint(container, d3_eventSource());
  };
  var d3_mouse_bug44083 = /WebKit/.test(d3_window.navigator.userAgent) ? -1 : 0;
  function d3_mousePoint(container, e) {
    if (e.changedTouches) e = e.changedTouches[0];
    var svg = container.ownerSVGElement || container;
    if (svg.createSVGPoint) {
      var point = svg.createSVGPoint();
      if (d3_mouse_bug44083 < 0 && (d3_window.scrollX || d3_window.scrollY)) {
        svg = d3.select("body").append("svg").style({
          position: "absolute",
          top: 0,
          left: 0,
          margin: 0,
          padding: 0,
          border: "none"
        }, "important");
        var ctm = svg[0][0].getScreenCTM();
        d3_mouse_bug44083 = !(ctm.f || ctm.e);
        svg.remove();
      }
      if (d3_mouse_bug44083) point.x = e.pageX, point.y = e.pageY; else point.x = e.clientX, 
      point.y = e.clientY;
      point = point.matrixTransform(container.getScreenCTM().inverse());
      return [ point.x, point.y ];
    }
    var rect = container.getBoundingClientRect();
    return [ e.clientX - rect.left - container.clientLeft, e.clientY - rect.top - container.clientTop ];
  }
  d3.touch = function(container, touches, identifier) {
    if (arguments.length < 3) identifier = touches, touches = d3_eventSource().changedTouches;
    if (touches) for (var i = 0, n = touches.length, touch; i < n; ++i) {
      if ((touch = touches[i]).identifier === identifier) {
        return d3_mousePoint(container, touch);
      }
    }
  };
  d3.behavior.drag = function() {
    var event = d3_eventDispatch(drag, "drag", "dragstart", "dragend"), origin = null, mousedown = dragstart(d3_noop, d3.mouse, d3_behavior_dragMouseSubject, "mousemove", "mouseup"), touchstart = dragstart(d3_behavior_dragTouchId, d3.touch, d3_behavior_dragTouchSubject, "touchmove", "touchend");
    function drag() {
      this.on("mousedown.drag", mousedown).on("touchstart.drag", touchstart);
    }
    function dragstart(id, position, subject, move, end) {
      return function() {
        var that = this, target = d3.event.target, parent = that.parentNode, dispatch = event.of(that, arguments), dragged = 0, dragId = id(), dragName = ".drag" + (dragId == null ? "" : "-" + dragId), dragOffset, dragSubject = d3.select(subject()).on(move + dragName, moved).on(end + dragName, ended), dragRestore = d3_event_dragSuppress(), position0 = position(parent, dragId);
        if (origin) {
          dragOffset = origin.apply(that, arguments);
          dragOffset = [ dragOffset.x - position0[0], dragOffset.y - position0[1] ];
        } else {
          dragOffset = [ 0, 0 ];
        }
        dispatch({
          type: "dragstart"
        });
        function moved() {
          var position1 = position(parent, dragId), dx, dy;
          if (!position1) return;
          dx = position1[0] - position0[0];
          dy = position1[1] - position0[1];
          dragged |= dx | dy;
          position0 = position1;
          dispatch({
            type: "drag",
            x: position1[0] + dragOffset[0],
            y: position1[1] + dragOffset[1],
            dx: dx,
            dy: dy
          });
        }
        function ended() {
          if (!position(parent, dragId)) return;
          dragSubject.on(move + dragName, null).on(end + dragName, null);
          dragRestore(dragged && d3.event.target === target);
          dispatch({
            type: "dragend"
          });
        }
      };
    }
    drag.origin = function(x) {
      if (!arguments.length) return origin;
      origin = x;
      return drag;
    };
    return d3.rebind(drag, event, "on");
  };
  function d3_behavior_dragTouchId() {
    return d3.event.changedTouches[0].identifier;
  }
  function d3_behavior_dragTouchSubject() {
    return d3.event.target;
  }
  function d3_behavior_dragMouseSubject() {
    return d3_window;
  }
  d3.touches = function(container, touches) {
    if (arguments.length < 2) touches = d3_eventSource().touches;
    return touches ? d3_array(touches).map(function(touch) {
      var point = d3_mousePoint(container, touch);
      point.identifier = touch.identifier;
      return point;
    }) : [];
  };
  var ε = 1e-6, ε2 = ε * ε, π = Math.PI, τ = 2 * π, τε = τ - ε, halfπ = π / 2, d3_radians = π / 180, d3_degrees = 180 / π;
  function d3_sgn(x) {
    return x > 0 ? 1 : x < 0 ? -1 : 0;
  }
  function d3_cross2d(a, b, c) {
    return (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
  }
  function d3_acos(x) {
    return x > 1 ? 0 : x < -1 ? π : Math.acos(x);
  }
  function d3_asin(x) {
    return x > 1 ? halfπ : x < -1 ? -halfπ : Math.asin(x);
  }
  function d3_sinh(x) {
    return ((x = Math.exp(x)) - 1 / x) / 2;
  }
  function d3_cosh(x) {
    return ((x = Math.exp(x)) + 1 / x) / 2;
  }
  function d3_tanh(x) {
    return ((x = Math.exp(2 * x)) - 1) / (x + 1);
  }
  function d3_haversin(x) {
    return (x = Math.sin(x / 2)) * x;
  }
  var ρ = Math.SQRT2, ρ2 = 2, ρ4 = 4;
  d3.interpolateZoom = function(p0, p1) {
    var ux0 = p0[0], uy0 = p0[1], w0 = p0[2], ux1 = p1[0], uy1 = p1[1], w1 = p1[2];
    var dx = ux1 - ux0, dy = uy1 - uy0, d2 = dx * dx + dy * dy, d1 = Math.sqrt(d2), b0 = (w1 * w1 - w0 * w0 + ρ4 * d2) / (2 * w0 * ρ2 * d1), b1 = (w1 * w1 - w0 * w0 - ρ4 * d2) / (2 * w1 * ρ2 * d1), r0 = Math.log(Math.sqrt(b0 * b0 + 1) - b0), r1 = Math.log(Math.sqrt(b1 * b1 + 1) - b1), dr = r1 - r0, S = (dr || Math.log(w1 / w0)) / ρ;
    function interpolate(t) {
      var s = t * S;
      if (dr) {
        var coshr0 = d3_cosh(r0), u = w0 / (ρ2 * d1) * (coshr0 * d3_tanh(ρ * s + r0) - d3_sinh(r0));
        return [ ux0 + u * dx, uy0 + u * dy, w0 * coshr0 / d3_cosh(ρ * s + r0) ];
      }
      return [ ux0 + t * dx, uy0 + t * dy, w0 * Math.exp(ρ * s) ];
    }
    interpolate.duration = S * 1e3;
    return interpolate;
  };
  d3.behavior.zoom = function() {
    var view = {
      x: 0,
      y: 0,
      k: 1
    }, translate0, center0, center, size = [ 960, 500 ], scaleExtent = d3_behavior_zoomInfinity, duration = 250, zooming = 0, mousedown = "mousedown.zoom", mousemove = "mousemove.zoom", mouseup = "mouseup.zoom", mousewheelTimer, touchstart = "touchstart.zoom", touchtime, event = d3_eventDispatch(zoom, "zoomstart", "zoom", "zoomend"), x0, x1, y0, y1;
    function zoom(g) {
      g.on(mousedown, mousedowned).on(d3_behavior_zoomWheel + ".zoom", mousewheeled).on("dblclick.zoom", dblclicked).on(touchstart, touchstarted);
    }
    zoom.event = function(g) {
      g.each(function() {
        var dispatch = event.of(this, arguments), view1 = view;
        if (d3_transitionInheritId) {
          d3.select(this).transition().each("start.zoom", function() {
            view = this.__chart__ || {
              x: 0,
              y: 0,
              k: 1
            };
            zoomstarted(dispatch);
          }).tween("zoom:zoom", function() {
            var dx = size[0], dy = size[1], cx = center0 ? center0[0] : dx / 2, cy = center0 ? center0[1] : dy / 2, i = d3.interpolateZoom([ (cx - view.x) / view.k, (cy - view.y) / view.k, dx / view.k ], [ (cx - view1.x) / view1.k, (cy - view1.y) / view1.k, dx / view1.k ]);
            return function(t) {
              var l = i(t), k = dx / l[2];
              this.__chart__ = view = {
                x: cx - l[0] * k,
                y: cy - l[1] * k,
                k: k
              };
              zoomed(dispatch);
            };
          }).each("interrupt.zoom", function() {
            zoomended(dispatch);
          }).each("end.zoom", function() {
            zoomended(dispatch);
          });
        } else {
          this.__chart__ = view;
          zoomstarted(dispatch);
          zoomed(dispatch);
          zoomended(dispatch);
        }
      });
    };
    zoom.translate = function(_) {
      if (!arguments.length) return [ view.x, view.y ];
      view = {
        x: +_[0],
        y: +_[1],
        k: view.k
      };
      rescale();
      return zoom;
    };
    zoom.scale = function(_) {
      if (!arguments.length) return view.k;
      view = {
        x: view.x,
        y: view.y,
        k: +_
      };
      rescale();
      return zoom;
    };
    zoom.scaleExtent = function(_) {
      if (!arguments.length) return scaleExtent;
      scaleExtent = _ == null ? d3_behavior_zoomInfinity : [ +_[0], +_[1] ];
      return zoom;
    };
    zoom.center = function(_) {
      if (!arguments.length) return center;
      center = _ && [ +_[0], +_[1] ];
      return zoom;
    };
    zoom.size = function(_) {
      if (!arguments.length) return size;
      size = _ && [ +_[0], +_[1] ];
      return zoom;
    };
    zoom.duration = function(_) {
      if (!arguments.length) return duration;
      duration = +_;
      return zoom;
    };
    zoom.x = function(z) {
      if (!arguments.length) return x1;
      x1 = z;
      x0 = z.copy();
      view = {
        x: 0,
        y: 0,
        k: 1
      };
      return zoom;
    };
    zoom.y = function(z) {
      if (!arguments.length) return y1;
      y1 = z;
      y0 = z.copy();
      view = {
        x: 0,
        y: 0,
        k: 1
      };
      return zoom;
    };
    function location(p) {
      return [ (p[0] - view.x) / view.k, (p[1] - view.y) / view.k ];
    }
    function point(l) {
      return [ l[0] * view.k + view.x, l[1] * view.k + view.y ];
    }
    function scaleTo(s) {
      view.k = Math.max(scaleExtent[0], Math.min(scaleExtent[1], s));
    }
    function translateTo(p, l) {
      l = point(l);
      view.x += p[0] - l[0];
      view.y += p[1] - l[1];
    }
    function zoomTo(that, p, l, k) {
      that.__chart__ = {
        x: view.x,
        y: view.y,
        k: view.k
      };
      scaleTo(Math.pow(2, k));
      translateTo(center0 = p, l);
      that = d3.select(that);
      if (duration > 0) that = that.transition().duration(duration);
      that.call(zoom.event);
    }
    function rescale() {
      if (x1) x1.domain(x0.range().map(function(x) {
        return (x - view.x) / view.k;
      }).map(x0.invert));
      if (y1) y1.domain(y0.range().map(function(y) {
        return (y - view.y) / view.k;
      }).map(y0.invert));
    }
    function zoomstarted(dispatch) {
      if (!zooming++) dispatch({
        type: "zoomstart"
      });
    }
    function zoomed(dispatch) {
      rescale();
      dispatch({
        type: "zoom",
        scale: view.k,
        translate: [ view.x, view.y ]
      });
    }
    function zoomended(dispatch) {
      if (!--zooming) dispatch({
        type: "zoomend"
      });
      center0 = null;
    }
    function mousedowned() {
      var that = this, target = d3.event.target, dispatch = event.of(that, arguments), dragged = 0, subject = d3.select(d3_window).on(mousemove, moved).on(mouseup, ended), location0 = location(d3.mouse(that)), dragRestore = d3_event_dragSuppress();
      d3_selection_interrupt.call(that);
      zoomstarted(dispatch);
      function moved() {
        dragged = 1;
        translateTo(d3.mouse(that), location0);
        zoomed(dispatch);
      }
      function ended() {
        subject.on(mousemove, null).on(mouseup, null);
        dragRestore(dragged && d3.event.target === target);
        zoomended(dispatch);
      }
    }
    function touchstarted() {
      var that = this, dispatch = event.of(that, arguments), locations0 = {}, distance0 = 0, scale0, zoomName = ".zoom-" + d3.event.changedTouches[0].identifier, touchmove = "touchmove" + zoomName, touchend = "touchend" + zoomName, targets = [], subject = d3.select(that), dragRestore = d3_event_dragSuppress();
      started();
      zoomstarted(dispatch);
      subject.on(mousedown, null).on(touchstart, started);
      function relocate() {
        var touches = d3.touches(that);
        scale0 = view.k;
        touches.forEach(function(t) {
          if (t.identifier in locations0) locations0[t.identifier] = location(t);
        });
        return touches;
      }
      function started() {
        var target = d3.event.target;
        d3.select(target).on(touchmove, moved).on(touchend, ended);
        targets.push(target);
        var changed = d3.event.changedTouches;
        for (var i = 0, n = changed.length; i < n; ++i) {
          locations0[changed[i].identifier] = null;
        }
        var touches = relocate(), now = Date.now();
        if (touches.length === 1) {
          if (now - touchtime < 500) {
            var p = touches[0];
            zoomTo(that, p, locations0[p.identifier], Math.floor(Math.log(view.k) / Math.LN2) + 1);
            d3_eventPreventDefault();
          }
          touchtime = now;
        } else if (touches.length > 1) {
          var p = touches[0], q = touches[1], dx = p[0] - q[0], dy = p[1] - q[1];
          distance0 = dx * dx + dy * dy;
        }
      }
      function moved() {
        var touches = d3.touches(that), p0, l0, p1, l1;
        d3_selection_interrupt.call(that);
        for (var i = 0, n = touches.length; i < n; ++i, l1 = null) {
          p1 = touches[i];
          if (l1 = locations0[p1.identifier]) {
            if (l0) break;
            p0 = p1, l0 = l1;
          }
        }
        if (l1) {
          var distance1 = (distance1 = p1[0] - p0[0]) * distance1 + (distance1 = p1[1] - p0[1]) * distance1, scale1 = distance0 && Math.sqrt(distance1 / distance0);
          p0 = [ (p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2 ];
          l0 = [ (l0[0] + l1[0]) / 2, (l0[1] + l1[1]) / 2 ];
          scaleTo(scale1 * scale0);
        }
        touchtime = null;
        translateTo(p0, l0);
        zoomed(dispatch);
      }
      function ended() {
        if (d3.event.touches.length) {
          var changed = d3.event.changedTouches;
          for (var i = 0, n = changed.length; i < n; ++i) {
            delete locations0[changed[i].identifier];
          }
          for (var identifier in locations0) {
            return void relocate();
          }
        }
        d3.selectAll(targets).on(zoomName, null);
        subject.on(mousedown, mousedowned).on(touchstart, touchstarted);
        dragRestore();
        zoomended(dispatch);
      }
    }
    function mousewheeled() {
      var dispatch = event.of(this, arguments);
      if (mousewheelTimer) clearTimeout(mousewheelTimer); else translate0 = location(center0 = center || d3.mouse(this)), 
      d3_selection_interrupt.call(this), zoomstarted(dispatch);
      mousewheelTimer = setTimeout(function() {
        mousewheelTimer = null;
        zoomended(dispatch);
      }, 50);
      d3_eventPreventDefault();
      scaleTo(Math.pow(2, d3_behavior_zoomDelta() * .002) * view.k);
      translateTo(center0, translate0);
      zoomed(dispatch);
    }
    function dblclicked() {
      var p = d3.mouse(this), k = Math.log(view.k) / Math.LN2;
      zoomTo(this, p, location(p), d3.event.shiftKey ? Math.ceil(k) - 1 : Math.floor(k) + 1);
    }
    return d3.rebind(zoom, event, "on");
  };
  var d3_behavior_zoomInfinity = [ 0, Infinity ];
  var d3_behavior_zoomDelta, d3_behavior_zoomWheel = "onwheel" in d3_document ? (d3_behavior_zoomDelta = function() {
    return -d3.event.deltaY * (d3.event.deltaMode ? 120 : 1);
  }, "wheel") : "onmousewheel" in d3_document ? (d3_behavior_zoomDelta = function() {
    return d3.event.wheelDelta;
  }, "mousewheel") : (d3_behavior_zoomDelta = function() {
    return -d3.event.detail;
  }, "MozMousePixelScroll");
  d3.color = d3_color;
  function d3_color() {}
  d3_color.prototype.toString = function() {
    return this.rgb() + "";
  };
  d3.hsl = d3_hsl;
  function d3_hsl(h, s, l) {
    return this instanceof d3_hsl ? void (this.h = +h, this.s = +s, this.l = +l) : arguments.length < 2 ? h instanceof d3_hsl ? new d3_hsl(h.h, h.s, h.l) : d3_rgb_parse("" + h, d3_rgb_hsl, d3_hsl) : new d3_hsl(h, s, l);
  }
  var d3_hslPrototype = d3_hsl.prototype = new d3_color();
  d3_hslPrototype.brighter = function(k) {
    k = Math.pow(.7, arguments.length ? k : 1);
    return new d3_hsl(this.h, this.s, this.l / k);
  };
  d3_hslPrototype.darker = function(k) {
    k = Math.pow(.7, arguments.length ? k : 1);
    return new d3_hsl(this.h, this.s, k * this.l);
  };
  d3_hslPrototype.rgb = function() {
    return d3_hsl_rgb(this.h, this.s, this.l);
  };
  function d3_hsl_rgb(h, s, l) {
    var m1, m2;
    h = isNaN(h) ? 0 : (h %= 360) < 0 ? h + 360 : h;
    s = isNaN(s) ? 0 : s < 0 ? 0 : s > 1 ? 1 : s;
    l = l < 0 ? 0 : l > 1 ? 1 : l;
    m2 = l <= .5 ? l * (1 + s) : l + s - l * s;
    m1 = 2 * l - m2;
    function v(h) {
      if (h > 360) h -= 360; else if (h < 0) h += 360;
      if (h < 60) return m1 + (m2 - m1) * h / 60;
      if (h < 180) return m2;
      if (h < 240) return m1 + (m2 - m1) * (240 - h) / 60;
      return m1;
    }
    function vv(h) {
      return Math.round(v(h) * 255);
    }
    return new d3_rgb(vv(h + 120), vv(h), vv(h - 120));
  }
  d3.hcl = d3_hcl;
  function d3_hcl(h, c, l) {
    return this instanceof d3_hcl ? void (this.h = +h, this.c = +c, this.l = +l) : arguments.length < 2 ? h instanceof d3_hcl ? new d3_hcl(h.h, h.c, h.l) : h instanceof d3_lab ? d3_lab_hcl(h.l, h.a, h.b) : d3_lab_hcl((h = d3_rgb_lab((h = d3.rgb(h)).r, h.g, h.b)).l, h.a, h.b) : new d3_hcl(h, c, l);
  }
  var d3_hclPrototype = d3_hcl.prototype = new d3_color();
  d3_hclPrototype.brighter = function(k) {
    return new d3_hcl(this.h, this.c, Math.min(100, this.l + d3_lab_K * (arguments.length ? k : 1)));
  };
  d3_hclPrototype.darker = function(k) {
    return new d3_hcl(this.h, this.c, Math.max(0, this.l - d3_lab_K * (arguments.length ? k : 1)));
  };
  d3_hclPrototype.rgb = function() {
    return d3_hcl_lab(this.h, this.c, this.l).rgb();
  };
  function d3_hcl_lab(h, c, l) {
    if (isNaN(h)) h = 0;
    if (isNaN(c)) c = 0;
    return new d3_lab(l, Math.cos(h *= d3_radians) * c, Math.sin(h) * c);
  }
  d3.lab = d3_lab;
  function d3_lab(l, a, b) {
    return this instanceof d3_lab ? void (this.l = +l, this.a = +a, this.b = +b) : arguments.length < 2 ? l instanceof d3_lab ? new d3_lab(l.l, l.a, l.b) : l instanceof d3_hcl ? d3_hcl_lab(l.h, l.c, l.l) : d3_rgb_lab((l = d3_rgb(l)).r, l.g, l.b) : new d3_lab(l, a, b);
  }
  var d3_lab_K = 18;
  var d3_lab_X = .95047, d3_lab_Y = 1, d3_lab_Z = 1.08883;
  var d3_labPrototype = d3_lab.prototype = new d3_color();
  d3_labPrototype.brighter = function(k) {
    return new d3_lab(Math.min(100, this.l + d3_lab_K * (arguments.length ? k : 1)), this.a, this.b);
  };
  d3_labPrototype.darker = function(k) {
    return new d3_lab(Math.max(0, this.l - d3_lab_K * (arguments.length ? k : 1)), this.a, this.b);
  };
  d3_labPrototype.rgb = function() {
    return d3_lab_rgb(this.l, this.a, this.b);
  };
  function d3_lab_rgb(l, a, b) {
    var y = (l + 16) / 116, x = y + a / 500, z = y - b / 200;
    x = d3_lab_xyz(x) * d3_lab_X;
    y = d3_lab_xyz(y) * d3_lab_Y;
    z = d3_lab_xyz(z) * d3_lab_Z;
    return new d3_rgb(d3_xyz_rgb(3.2404542 * x - 1.5371385 * y - .4985314 * z), d3_xyz_rgb(-.969266 * x + 1.8760108 * y + .041556 * z), d3_xyz_rgb(.0556434 * x - .2040259 * y + 1.0572252 * z));
  }
  function d3_lab_hcl(l, a, b) {
    return l > 0 ? new d3_hcl(Math.atan2(b, a) * d3_degrees, Math.sqrt(a * a + b * b), l) : new d3_hcl(NaN, NaN, l);
  }
  function d3_lab_xyz(x) {
    return x > .206893034 ? x * x * x : (x - 4 / 29) / 7.787037;
  }
  function d3_xyz_lab(x) {
    return x > .008856 ? Math.pow(x, 1 / 3) : 7.787037 * x + 4 / 29;
  }
  function d3_xyz_rgb(r) {
    return Math.round(255 * (r <= .00304 ? 12.92 * r : 1.055 * Math.pow(r, 1 / 2.4) - .055));
  }
  d3.rgb = d3_rgb;
  function d3_rgb(r, g, b) {
    return this instanceof d3_rgb ? void (this.r = ~~r, this.g = ~~g, this.b = ~~b) : arguments.length < 2 ? r instanceof d3_rgb ? new d3_rgb(r.r, r.g, r.b) : d3_rgb_parse("" + r, d3_rgb, d3_hsl_rgb) : new d3_rgb(r, g, b);
  }
  function d3_rgbNumber(value) {
    return new d3_rgb(value >> 16, value >> 8 & 255, value & 255);
  }
  function d3_rgbString(value) {
    return d3_rgbNumber(value) + "";
  }
  var d3_rgbPrototype = d3_rgb.prototype = new d3_color();
  d3_rgbPrototype.brighter = function(k) {
    k = Math.pow(.7, arguments.length ? k : 1);
    var r = this.r, g = this.g, b = this.b, i = 30;
    if (!r && !g && !b) return new d3_rgb(i, i, i);
    if (r && r < i) r = i;
    if (g && g < i) g = i;
    if (b && b < i) b = i;
    return new d3_rgb(Math.min(255, r / k), Math.min(255, g / k), Math.min(255, b / k));
  };
  d3_rgbPrototype.darker = function(k) {
    k = Math.pow(.7, arguments.length ? k : 1);
    return new d3_rgb(k * this.r, k * this.g, k * this.b);
  };
  d3_rgbPrototype.hsl = function() {
    return d3_rgb_hsl(this.r, this.g, this.b);
  };
  d3_rgbPrototype.toString = function() {
    return "#" + d3_rgb_hex(this.r) + d3_rgb_hex(this.g) + d3_rgb_hex(this.b);
  };
  function d3_rgb_hex(v) {
    return v < 16 ? "0" + Math.max(0, v).toString(16) : Math.min(255, v).toString(16);
  }
  function d3_rgb_parse(format, rgb, hsl) {
    var r = 0, g = 0, b = 0, m1, m2, color;
    m1 = /([a-z]+)\((.*)\)/i.exec(format);
    if (m1) {
      m2 = m1[2].split(",");
      switch (m1[1]) {
       case "hsl":
        {
          return hsl(parseFloat(m2[0]), parseFloat(m2[1]) / 100, parseFloat(m2[2]) / 100);
        }

       case "rgb":
        {
          return rgb(d3_rgb_parseNumber(m2[0]), d3_rgb_parseNumber(m2[1]), d3_rgb_parseNumber(m2[2]));
        }
      }
    }
    if (color = d3_rgb_names.get(format)) return rgb(color.r, color.g, color.b);
    if (format != null && format.charAt(0) === "#" && !isNaN(color = parseInt(format.slice(1), 16))) {
      if (format.length === 4) {
        r = (color & 3840) >> 4;
        r = r >> 4 | r;
        g = color & 240;
        g = g >> 4 | g;
        b = color & 15;
        b = b << 4 | b;
      } else if (format.length === 7) {
        r = (color & 16711680) >> 16;
        g = (color & 65280) >> 8;
        b = color & 255;
      }
    }
    return rgb(r, g, b);
  }
  function d3_rgb_hsl(r, g, b) {
    var min = Math.min(r /= 255, g /= 255, b /= 255), max = Math.max(r, g, b), d = max - min, h, s, l = (max + min) / 2;
    if (d) {
      s = l < .5 ? d / (max + min) : d / (2 - max - min);
      if (r == max) h = (g - b) / d + (g < b ? 6 : 0); else if (g == max) h = (b - r) / d + 2; else h = (r - g) / d + 4;
      h *= 60;
    } else {
      h = NaN;
      s = l > 0 && l < 1 ? 0 : h;
    }
    return new d3_hsl(h, s, l);
  }
  function d3_rgb_lab(r, g, b) {
    r = d3_rgb_xyz(r);
    g = d3_rgb_xyz(g);
    b = d3_rgb_xyz(b);
    var x = d3_xyz_lab((.4124564 * r + .3575761 * g + .1804375 * b) / d3_lab_X), y = d3_xyz_lab((.2126729 * r + .7151522 * g + .072175 * b) / d3_lab_Y), z = d3_xyz_lab((.0193339 * r + .119192 * g + .9503041 * b) / d3_lab_Z);
    return d3_lab(116 * y - 16, 500 * (x - y), 200 * (y - z));
  }
  function d3_rgb_xyz(r) {
    return (r /= 255) <= .04045 ? r / 12.92 : Math.pow((r + .055) / 1.055, 2.4);
  }
  function d3_rgb_parseNumber(c) {
    var f = parseFloat(c);
    return c.charAt(c.length - 1) === "%" ? Math.round(f * 2.55) : f;
  }
  var d3_rgb_names = d3.map({
    aliceblue: 15792383,
    antiquewhite: 16444375,
    aqua: 65535,
    aquamarine: 8388564,
    azure: 15794175,
    beige: 16119260,
    bisque: 16770244,
    black: 0,
    blanchedalmond: 16772045,
    blue: 255,
    blueviolet: 9055202,
    brown: 10824234,
    burlywood: 14596231,
    cadetblue: 6266528,
    chartreuse: 8388352,
    chocolate: 13789470,
    coral: 16744272,
    cornflowerblue: 6591981,
    cornsilk: 16775388,
    crimson: 14423100,
    cyan: 65535,
    darkblue: 139,
    darkcyan: 35723,
    darkgoldenrod: 12092939,
    darkgray: 11119017,
    darkgreen: 25600,
    darkgrey: 11119017,
    darkkhaki: 12433259,
    darkmagenta: 9109643,
    darkolivegreen: 5597999,
    darkorange: 16747520,
    darkorchid: 10040012,
    darkred: 9109504,
    darksalmon: 15308410,
    darkseagreen: 9419919,
    darkslateblue: 4734347,
    darkslategray: 3100495,
    darkslategrey: 3100495,
    darkturquoise: 52945,
    darkviolet: 9699539,
    deeppink: 16716947,
    deepskyblue: 49151,
    dimgray: 6908265,
    dimgrey: 6908265,
    dodgerblue: 2003199,
    firebrick: 11674146,
    floralwhite: 16775920,
    forestgreen: 2263842,
    fuchsia: 16711935,
    gainsboro: 14474460,
    ghostwhite: 16316671,
    gold: 16766720,
    goldenrod: 14329120,
    gray: 8421504,
    green: 32768,
    greenyellow: 11403055,
    grey: 8421504,
    honeydew: 15794160,
    hotpink: 16738740,
    indianred: 13458524,
    indigo: 4915330,
    ivory: 16777200,
    khaki: 15787660,
    lavender: 15132410,
    lavenderblush: 16773365,
    lawngreen: 8190976,
    lemonchiffon: 16775885,
    lightblue: 11393254,
    lightcoral: 15761536,
    lightcyan: 14745599,
    lightgoldenrodyellow: 16448210,
    lightgray: 13882323,
    lightgreen: 9498256,
    lightgrey: 13882323,
    lightpink: 16758465,
    lightsalmon: 16752762,
    lightseagreen: 2142890,
    lightskyblue: 8900346,
    lightslategray: 7833753,
    lightslategrey: 7833753,
    lightsteelblue: 11584734,
    lightyellow: 16777184,
    lime: 65280,
    limegreen: 3329330,
    linen: 16445670,
    magenta: 16711935,
    maroon: 8388608,
    mediumaquamarine: 6737322,
    mediumblue: 205,
    mediumorchid: 12211667,
    mediumpurple: 9662683,
    mediumseagreen: 3978097,
    mediumslateblue: 8087790,
    mediumspringgreen: 64154,
    mediumturquoise: 4772300,
    mediumvioletred: 13047173,
    midnightblue: 1644912,
    mintcream: 16121850,
    mistyrose: 16770273,
    moccasin: 16770229,
    navajowhite: 16768685,
    navy: 128,
    oldlace: 16643558,
    olive: 8421376,
    olivedrab: 7048739,
    orange: 16753920,
    orangered: 16729344,
    orchid: 14315734,
    palegoldenrod: 15657130,
    palegreen: 10025880,
    paleturquoise: 11529966,
    palevioletred: 14381203,
    papayawhip: 16773077,
    peachpuff: 16767673,
    peru: 13468991,
    pink: 16761035,
    plum: 14524637,
    powderblue: 11591910,
    purple: 8388736,
    red: 16711680,
    rosybrown: 12357519,
    royalblue: 4286945,
    saddlebrown: 9127187,
    salmon: 16416882,
    sandybrown: 16032864,
    seagreen: 3050327,
    seashell: 16774638,
    sienna: 10506797,
    silver: 12632256,
    skyblue: 8900331,
    slateblue: 6970061,
    slategray: 7372944,
    slategrey: 7372944,
    snow: 16775930,
    springgreen: 65407,
    steelblue: 4620980,
    tan: 13808780,
    teal: 32896,
    thistle: 14204888,
    tomato: 16737095,
    turquoise: 4251856,
    violet: 15631086,
    wheat: 16113331,
    white: 16777215,
    whitesmoke: 16119285,
    yellow: 16776960,
    yellowgreen: 10145074
  });
  d3_rgb_names.forEach(function(key, value) {
    d3_rgb_names.set(key, d3_rgbNumber(value));
  });
  function d3_functor(v) {
    return typeof v === "function" ? v : function() {
      return v;
    };
  }
  d3.functor = d3_functor;
  function d3_identity(d) {
    return d;
  }
  d3.xhr = d3_xhrType(d3_identity);
  function d3_xhrType(response) {
    return function(url, mimeType, callback) {
      if (arguments.length === 2 && typeof mimeType === "function") callback = mimeType, 
      mimeType = null;
      return d3_xhr(url, mimeType, response, callback);
    };
  }
  function d3_xhr(url, mimeType, response, callback) {
    var xhr = {}, dispatch = d3.dispatch("beforesend", "progress", "load", "error"), headers = {}, request = new XMLHttpRequest(), responseType = null;
    if (d3_window.XDomainRequest && !("withCredentials" in request) && /^(http(s)?:)?\/\//.test(url)) request = new XDomainRequest();
    "onload" in request ? request.onload = request.onerror = respond : request.onreadystatechange = function() {
      request.readyState > 3 && respond();
    };
    function respond() {
      var status = request.status, result;
      if (!status && d3_xhrHasResponse(request) || status >= 200 && status < 300 || status === 304) {
        try {
          result = response.call(xhr, request);
        } catch (e) {
          dispatch.error.call(xhr, e);
          return;
        }
        dispatch.load.call(xhr, result);
      } else {
        dispatch.error.call(xhr, request);
      }
    }
    request.onprogress = function(event) {
      var o = d3.event;
      d3.event = event;
      try {
        dispatch.progress.call(xhr, request);
      } finally {
        d3.event = o;
      }
    };
    xhr.header = function(name, value) {
      name = (name + "").toLowerCase();
      if (arguments.length < 2) return headers[name];
      if (value == null) delete headers[name]; else headers[name] = value + "";
      return xhr;
    };
    xhr.mimeType = function(value) {
      if (!arguments.length) return mimeType;
      mimeType = value == null ? null : value + "";
      return xhr;
    };
    xhr.responseType = function(value) {
      if (!arguments.length) return responseType;
      responseType = value;
      return xhr;
    };
    xhr.response = function(value) {
      response = value;
      return xhr;
    };
    [ "get", "post" ].forEach(function(method) {
      xhr[method] = function() {
        return xhr.send.apply(xhr, [ method ].concat(d3_array(arguments)));
      };
    });
    xhr.send = function(method, data, callback) {
      if (arguments.length === 2 && typeof data === "function") callback = data, data = null;
      request.open(method, url, true);
      if (mimeType != null && !("accept" in headers)) headers["accept"] = mimeType + ",*/*";
      if (request.setRequestHeader) for (var name in headers) request.setRequestHeader(name, headers[name]);
      if (mimeType != null && request.overrideMimeType) request.overrideMimeType(mimeType);
      if (responseType != null) request.responseType = responseType;
      if (callback != null) xhr.on("error", callback).on("load", function(request) {
        callback(null, request);
      });
      dispatch.beforesend.call(xhr, request);
      request.send(data == null ? null : data);
      return xhr;
    };
    xhr.abort = function() {
      request.abort();
      return xhr;
    };
    d3.rebind(xhr, dispatch, "on");
    return callback == null ? xhr : xhr.get(d3_xhr_fixCallback(callback));
  }
  function d3_xhr_fixCallback(callback) {
    return callback.length === 1 ? function(error, request) {
      callback(error == null ? request : null);
    } : callback;
  }
  function d3_xhrHasResponse(request) {
    var type = request.responseType;
    return type && type !== "text" ? request.response : request.responseText;
  }
  d3.dsv = function(delimiter, mimeType) {
    var reFormat = new RegExp('["' + delimiter + "\n]"), delimiterCode = delimiter.charCodeAt(0);
    function dsv(url, row, callback) {
      if (arguments.length < 3) callback = row, row = null;
      var xhr = d3_xhr(url, mimeType, row == null ? response : typedResponse(row), callback);
      xhr.row = function(_) {
        return arguments.length ? xhr.response((row = _) == null ? response : typedResponse(_)) : row;
      };
      return xhr;
    }
    function response(request) {
      return dsv.parse(request.responseText);
    }
    function typedResponse(f) {
      return function(request) {
        return dsv.parse(request.responseText, f);
      };
    }
    dsv.parse = function(text, f) {
      var o;
      return dsv.parseRows(text, function(row, i) {
        if (o) return o(row, i - 1);
        var a = new Function("d", "return {" + row.map(function(name, i) {
          return JSON.stringify(name) + ": d[" + i + "]";
        }).join(",") + "}");
        o = f ? function(row, i) {
          return f(a(row), i);
        } : a;
      });
    };
    dsv.parseRows = function(text, f) {
      var EOL = {}, EOF = {}, rows = [], N = text.length, I = 0, n = 0, t, eol;
      function token() {
        if (I >= N) return EOF;
        if (eol) return eol = false, EOL;
        var j = I;
        if (text.charCodeAt(j) === 34) {
          var i = j;
          while (i++ < N) {
            if (text.charCodeAt(i) === 34) {
              if (text.charCodeAt(i + 1) !== 34) break;
              ++i;
            }
          }
          I = i + 2;
          var c = text.charCodeAt(i + 1);
          if (c === 13) {
            eol = true;
            if (text.charCodeAt(i + 2) === 10) ++I;
          } else if (c === 10) {
            eol = true;
          }
          return text.slice(j + 1, i).replace(/""/g, '"');
        }
        while (I < N) {
          var c = text.charCodeAt(I++), k = 1;
          if (c === 10) eol = true; else if (c === 13) {
            eol = true;
            if (text.charCodeAt(I) === 10) ++I, ++k;
          } else if (c !== delimiterCode) continue;
          return text.slice(j, I - k);
        }
        return text.slice(j);
      }
      while ((t = token()) !== EOF) {
        var a = [];
        while (t !== EOL && t !== EOF) {
          a.push(t);
          t = token();
        }
        if (f && (a = f(a, n++)) == null) continue;
        rows.push(a);
      }
      return rows;
    };
    dsv.format = function(rows) {
      if (Array.isArray(rows[0])) return dsv.formatRows(rows);
      var fieldSet = new d3_Set(), fields = [];
      rows.forEach(function(row) {
        for (var field in row) {
          if (!fieldSet.has(field)) {
            fields.push(fieldSet.add(field));
          }
        }
      });
      return [ fields.map(formatValue).join(delimiter) ].concat(rows.map(function(row) {
        return fields.map(function(field) {
          return formatValue(row[field]);
        }).join(delimiter);
      })).join("\n");
    };
    dsv.formatRows = function(rows) {
      return rows.map(formatRow).join("\n");
    };
    function formatRow(row) {
      return row.map(formatValue).join(delimiter);
    }
    function formatValue(text) {
      return reFormat.test(text) ? '"' + text.replace(/\"/g, '""') + '"' : text;
    }
    return dsv;
  };
  d3.csv = d3.dsv(",", "text/csv");
  d3.tsv = d3.dsv("	", "text/tab-separated-values");
  var d3_timer_queueHead, d3_timer_queueTail, d3_timer_interval, d3_timer_timeout, d3_timer_active, d3_timer_frame = d3_window[d3_vendorSymbol(d3_window, "requestAnimationFrame")] || function(callback) {
    setTimeout(callback, 17);
  };
  d3.timer = function(callback, delay, then) {
    var n = arguments.length;
    if (n < 2) delay = 0;
    if (n < 3) then = Date.now();
    var time = then + delay, timer = {
      c: callback,
      t: time,
      f: false,
      n: null
    };
    if (d3_timer_queueTail) d3_timer_queueTail.n = timer; else d3_timer_queueHead = timer;
    d3_timer_queueTail = timer;
    if (!d3_timer_interval) {
      d3_timer_timeout = clearTimeout(d3_timer_timeout);
      d3_timer_interval = 1;
      d3_timer_frame(d3_timer_step);
    }
  };
  function d3_timer_step() {
    var now = d3_timer_mark(), delay = d3_timer_sweep() - now;
    if (delay > 24) {
      if (isFinite(delay)) {
        clearTimeout(d3_timer_timeout);
        d3_timer_timeout = setTimeout(d3_timer_step, delay);
      }
      d3_timer_interval = 0;
    } else {
      d3_timer_interval = 1;
      d3_timer_frame(d3_timer_step);
    }
  }
  d3.timer.flush = function() {
    d3_timer_mark();
    d3_timer_sweep();
  };
  function d3_timer_mark() {
    var now = Date.now();
    d3_timer_active = d3_timer_queueHead;
    while (d3_timer_active) {
      if (now >= d3_timer_active.t) d3_timer_active.f = d3_timer_active.c(now - d3_timer_active.t);
      d3_timer_active = d3_timer_active.n;
    }
    return now;
  }
  function d3_timer_sweep() {
    var t0, t1 = d3_timer_queueHead, time = Infinity;
    while (t1) {
      if (t1.f) {
        t1 = t0 ? t0.n = t1.n : d3_timer_queueHead = t1.n;
      } else {
        if (t1.t < time) time = t1.t;
        t1 = (t0 = t1).n;
      }
    }
    d3_timer_queueTail = t0;
    return time;
  }
  function d3_format_precision(x, p) {
    return p - (x ? Math.ceil(Math.log(x) / Math.LN10) : 1);
  }
  d3.round = function(x, n) {
    return n ? Math.round(x * (n = Math.pow(10, n))) / n : Math.round(x);
  };
  var d3_formatPrefixes = [ "y", "z", "a", "f", "p", "n", "µ", "m", "", "k", "M", "G", "T", "P", "E", "Z", "Y" ].map(d3_formatPrefix);
  d3.formatPrefix = function(value, precision) {
    var i = 0;
    if (value) {
      if (value < 0) value *= -1;
      if (precision) value = d3.round(value, d3_format_precision(value, precision));
      i = 1 + Math.floor(1e-12 + Math.log(value) / Math.LN10);
      i = Math.max(-24, Math.min(24, Math.floor((i - 1) / 3) * 3));
    }
    return d3_formatPrefixes[8 + i / 3];
  };
  function d3_formatPrefix(d, i) {
    var k = Math.pow(10, abs(8 - i) * 3);
    return {
      scale: i > 8 ? function(d) {
        return d / k;
      } : function(d) {
        return d * k;
      },
      symbol: d
    };
  }
  function d3_locale_numberFormat(locale) {
    var locale_decimal = locale.decimal, locale_thousands = locale.thousands, locale_grouping = locale.grouping, locale_currency = locale.currency, formatGroup = locale_grouping && locale_thousands ? function(value, width) {
      var i = value.length, t = [], j = 0, g = locale_grouping[0], length = 0;
      while (i > 0 && g > 0) {
        if (length + g + 1 > width) g = Math.max(1, width - length);
        t.push(value.substring(i -= g, i + g));
        if ((length += g + 1) > width) break;
        g = locale_grouping[j = (j + 1) % locale_grouping.length];
      }
      return t.reverse().join(locale_thousands);
    } : d3_identity;
    return function(specifier) {
      var match = d3_format_re.exec(specifier), fill = match[1] || " ", align = match[2] || ">", sign = match[3] || "-", symbol = match[4] || "", zfill = match[5], width = +match[6], comma = match[7], precision = match[8], type = match[9], scale = 1, prefix = "", suffix = "", integer = false, exponent = true;
      if (precision) precision = +precision.substring(1);
      if (zfill || fill === "0" && align === "=") {
        zfill = fill = "0";
        align = "=";
      }
      switch (type) {
       case "n":
        comma = true;
        type = "g";
        break;

       case "%":
        scale = 100;
        suffix = "%";
        type = "f";
        break;

       case "p":
        scale = 100;
        suffix = "%";
        type = "r";
        break;

       case "b":
       case "o":
       case "x":
       case "X":
        if (symbol === "#") prefix = "0" + type.toLowerCase();

       case "c":
        exponent = false;

       case "d":
        integer = true;
        precision = 0;
        break;

       case "s":
        scale = -1;
        type = "r";
        break;
      }
      if (symbol === "$") prefix = locale_currency[0], suffix = locale_currency[1];
      if (type == "r" && !precision) type = "g";
      if (precision != null) {
        if (type == "g") precision = Math.max(1, Math.min(21, precision)); else if (type == "e" || type == "f") precision = Math.max(0, Math.min(20, precision));
      }
      type = d3_format_types.get(type) || d3_format_typeDefault;
      var zcomma = zfill && comma;
      return function(value) {
        var fullSuffix = suffix;
        if (integer && value % 1) return "";
        var negative = value < 0 || value === 0 && 1 / value < 0 ? (value = -value, "-") : sign === "-" ? "" : sign;
        if (scale < 0) {
          var unit = d3.formatPrefix(value, precision);
          value = unit.scale(value);
          fullSuffix = unit.symbol + suffix;
        } else {
          value *= scale;
        }
        value = type(value, precision);
        var i = value.lastIndexOf("."), before, after;
        if (i < 0) {
          var j = exponent ? value.lastIndexOf("e") : -1;
          if (j < 0) before = value, after = ""; else before = value.substring(0, j), after = value.substring(j);
        } else {
          before = value.substring(0, i);
          after = locale_decimal + value.substring(i + 1);
        }
        if (!zfill && comma) before = formatGroup(before, Infinity);
        var length = prefix.length + before.length + after.length + (zcomma ? 0 : negative.length), padding = length < width ? new Array(length = width - length + 1).join(fill) : "";
        if (zcomma) before = formatGroup(padding + before, padding.length ? width - after.length : Infinity);
        negative += prefix;
        value = before + after;
        return (align === "<" ? negative + value + padding : align === ">" ? padding + negative + value : align === "^" ? padding.substring(0, length >>= 1) + negative + value + padding.substring(length) : negative + (zcomma ? value : padding + value)) + fullSuffix;
      };
    };
  }
  var d3_format_re = /(?:([^{])?([<>=^]))?([+\- ])?([$#])?(0)?(\d+)?(,)?(\.-?\d+)?([a-z%])?/i;
  var d3_format_types = d3.map({
    b: function(x) {
      return x.toString(2);
    },
    c: function(x) {
      return String.fromCharCode(x);
    },
    o: function(x) {
      return x.toString(8);
    },
    x: function(x) {
      return x.toString(16);
    },
    X: function(x) {
      return x.toString(16).toUpperCase();
    },
    g: function(x, p) {
      return x.toPrecision(p);
    },
    e: function(x, p) {
      return x.toExponential(p);
    },
    f: function(x, p) {
      return x.toFixed(p);
    },
    r: function(x, p) {
      return (x = d3.round(x, d3_format_precision(x, p))).toFixed(Math.max(0, Math.min(20, d3_format_precision(x * (1 + 1e-15), p))));
    }
  });
  function d3_format_typeDefault(x) {
    return x + "";
  }
  var d3_time = d3.time = {}, d3_date = Date;
  function d3_date_utc() {
    this._ = new Date(arguments.length > 1 ? Date.UTC.apply(this, arguments) : arguments[0]);
  }
  d3_date_utc.prototype = {
    getDate: function() {
      return this._.getUTCDate();
    },
    getDay: function() {
      return this._.getUTCDay();
    },
    getFullYear: function() {
      return this._.getUTCFullYear();
    },
    getHours: function() {
      return this._.getUTCHours();
    },
    getMilliseconds: function() {
      return this._.getUTCMilliseconds();
    },
    getMinutes: function() {
      return this._.getUTCMinutes();
    },
    getMonth: function() {
      return this._.getUTCMonth();
    },
    getSeconds: function() {
      return this._.getUTCSeconds();
    },
    getTime: function() {
      return this._.getTime();
    },
    getTimezoneOffset: function() {
      return 0;
    },
    valueOf: function() {
      return this._.valueOf();
    },
    setDate: function() {
      d3_time_prototype.setUTCDate.apply(this._, arguments);
    },
    setDay: function() {
      d3_time_prototype.setUTCDay.apply(this._, arguments);
    },
    setFullYear: function() {
      d3_time_prototype.setUTCFullYear.apply(this._, arguments);
    },
    setHours: function() {
      d3_time_prototype.setUTCHours.apply(this._, arguments);
    },
    setMilliseconds: function() {
      d3_time_prototype.setUTCMilliseconds.apply(this._, arguments);
    },
    setMinutes: function() {
      d3_time_prototype.setUTCMinutes.apply(this._, arguments);
    },
    setMonth: function() {
      d3_time_prototype.setUTCMonth.apply(this._, arguments);
    },
    setSeconds: function() {
      d3_time_prototype.setUTCSeconds.apply(this._, arguments);
    },
    setTime: function() {
      d3_time_prototype.setTime.apply(this._, arguments);
    }
  };
  var d3_time_prototype = Date.prototype;
  function d3_time_interval(local, step, number) {
    function round(date) {
      var d0 = local(date), d1 = offset(d0, 1);
      return date - d0 < d1 - date ? d0 : d1;
    }
    function ceil(date) {
      step(date = local(new d3_date(date - 1)), 1);
      return date;
    }
    function offset(date, k) {
      step(date = new d3_date(+date), k);
      return date;
    }
    function range(t0, t1, dt) {
      var time = ceil(t0), times = [];
      if (dt > 1) {
        while (time < t1) {
          if (!(number(time) % dt)) times.push(new Date(+time));
          step(time, 1);
        }
      } else {
        while (time < t1) times.push(new Date(+time)), step(time, 1);
      }
      return times;
    }
    function range_utc(t0, t1, dt) {
      try {
        d3_date = d3_date_utc;
        var utc = new d3_date_utc();
        utc._ = t0;
        return range(utc, t1, dt);
      } finally {
        d3_date = Date;
      }
    }
    local.floor = local;
    local.round = round;
    local.ceil = ceil;
    local.offset = offset;
    local.range = range;
    var utc = local.utc = d3_time_interval_utc(local);
    utc.floor = utc;
    utc.round = d3_time_interval_utc(round);
    utc.ceil = d3_time_interval_utc(ceil);
    utc.offset = d3_time_interval_utc(offset);
    utc.range = range_utc;
    return local;
  }
  function d3_time_interval_utc(method) {
    return function(date, k) {
      try {
        d3_date = d3_date_utc;
        var utc = new d3_date_utc();
        utc._ = date;
        return method(utc, k)._;
      } finally {
        d3_date = Date;
      }
    };
  }
  d3_time.year = d3_time_interval(function(date) {
    date = d3_time.day(date);
    date.setMonth(0, 1);
    return date;
  }, function(date, offset) {
    date.setFullYear(date.getFullYear() + offset);
  }, function(date) {
    return date.getFullYear();
  });
  d3_time.years = d3_time.year.range;
  d3_time.years.utc = d3_time.year.utc.range;
  d3_time.day = d3_time_interval(function(date) {
    var day = new d3_date(2e3, 0);
    day.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
    return day;
  }, function(date, offset) {
    date.setDate(date.getDate() + offset);
  }, function(date) {
    return date.getDate() - 1;
  });
  d3_time.days = d3_time.day.range;
  d3_time.days.utc = d3_time.day.utc.range;
  d3_time.dayOfYear = function(date) {
    var year = d3_time.year(date);
    return Math.floor((date - year - (date.getTimezoneOffset() - year.getTimezoneOffset()) * 6e4) / 864e5);
  };
  [ "sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday" ].forEach(function(day, i) {
    i = 7 - i;
    var interval = d3_time[day] = d3_time_interval(function(date) {
      (date = d3_time.day(date)).setDate(date.getDate() - (date.getDay() + i) % 7);
      return date;
    }, function(date, offset) {
      date.setDate(date.getDate() + Math.floor(offset) * 7);
    }, function(date) {
      var day = d3_time.year(date).getDay();
      return Math.floor((d3_time.dayOfYear(date) + (day + i) % 7) / 7) - (day !== i);
    });
    d3_time[day + "s"] = interval.range;
    d3_time[day + "s"].utc = interval.utc.range;
    d3_time[day + "OfYear"] = function(date) {
      var day = d3_time.year(date).getDay();
      return Math.floor((d3_time.dayOfYear(date) + (day + i) % 7) / 7);
    };
  });
  d3_time.week = d3_time.sunday;
  d3_time.weeks = d3_time.sunday.range;
  d3_time.weeks.utc = d3_time.sunday.utc.range;
  d3_time.weekOfYear = d3_time.sundayOfYear;
  function d3_locale_timeFormat(locale) {
    var locale_dateTime = locale.dateTime, locale_date = locale.date, locale_time = locale.time, locale_periods = locale.periods, locale_days = locale.days, locale_shortDays = locale.shortDays, locale_months = locale.months, locale_shortMonths = locale.shortMonths;
    function d3_time_format(template) {
      var n = template.length;
      function format(date) {
        var string = [], i = -1, j = 0, c, p, f;
        while (++i < n) {
          if (template.charCodeAt(i) === 37) {
            string.push(template.slice(j, i));
            if ((p = d3_time_formatPads[c = template.charAt(++i)]) != null) c = template.charAt(++i);
            if (f = d3_time_formats[c]) c = f(date, p == null ? c === "e" ? " " : "0" : p);
            string.push(c);
            j = i + 1;
          }
        }
        string.push(template.slice(j, i));
        return string.join("");
      }
      format.parse = function(string) {
        var d = {
          y: 1900,
          m: 0,
          d: 1,
          H: 0,
          M: 0,
          S: 0,
          L: 0,
          Z: null
        }, i = d3_time_parse(d, template, string, 0);
        if (i != string.length) return null;
        if ("p" in d) d.H = d.H % 12 + d.p * 12;
        var localZ = d.Z != null && d3_date !== d3_date_utc, date = new (localZ ? d3_date_utc : d3_date)();
        if ("j" in d) date.setFullYear(d.y, 0, d.j); else if ("w" in d && ("W" in d || "U" in d)) {
          date.setFullYear(d.y, 0, 1);
          date.setFullYear(d.y, 0, "W" in d ? (d.w + 6) % 7 + d.W * 7 - (date.getDay() + 5) % 7 : d.w + d.U * 7 - (date.getDay() + 6) % 7);
        } else date.setFullYear(d.y, d.m, d.d);
        date.setHours(d.H + (d.Z / 100 | 0), d.M + d.Z % 100, d.S, d.L);
        return localZ ? date._ : date;
      };
      format.toString = function() {
        return template;
      };
      return format;
    }
    function d3_time_parse(date, template, string, j) {
      var c, p, t, i = 0, n = template.length, m = string.length;
      while (i < n) {
        if (j >= m) return -1;
        c = template.charCodeAt(i++);
        if (c === 37) {
          t = template.charAt(i++);
          p = d3_time_parsers[t in d3_time_formatPads ? template.charAt(i++) : t];
          if (!p || (j = p(date, string, j)) < 0) return -1;
        } else if (c != string.charCodeAt(j++)) {
          return -1;
        }
      }
      return j;
    }
    d3_time_format.utc = function(template) {
      var local = d3_time_format(template);
      function format(date) {
        try {
          d3_date = d3_date_utc;
          var utc = new d3_date();
          utc._ = date;
          return local(utc);
        } finally {
          d3_date = Date;
        }
      }
      format.parse = function(string) {
        try {
          d3_date = d3_date_utc;
          var date = local.parse(string);
          return date && date._;
        } finally {
          d3_date = Date;
        }
      };
      format.toString = local.toString;
      return format;
    };
    d3_time_format.multi = d3_time_format.utc.multi = d3_time_formatMulti;
    var d3_time_periodLookup = d3.map(), d3_time_dayRe = d3_time_formatRe(locale_days), d3_time_dayLookup = d3_time_formatLookup(locale_days), d3_time_dayAbbrevRe = d3_time_formatRe(locale_shortDays), d3_time_dayAbbrevLookup = d3_time_formatLookup(locale_shortDays), d3_time_monthRe = d3_time_formatRe(locale_months), d3_time_monthLookup = d3_time_formatLookup(locale_months), d3_time_monthAbbrevRe = d3_time_formatRe(locale_shortMonths), d3_time_monthAbbrevLookup = d3_time_formatLookup(locale_shortMonths);
    locale_periods.forEach(function(p, i) {
      d3_time_periodLookup.set(p.toLowerCase(), i);
    });
    var d3_time_formats = {
      a: function(d) {
        return locale_shortDays[d.getDay()];
      },
      A: function(d) {
        return locale_days[d.getDay()];
      },
      b: function(d) {
        return locale_shortMonths[d.getMonth()];
      },
      B: function(d) {
        return locale_months[d.getMonth()];
      },
      c: d3_time_format(locale_dateTime),
      d: function(d, p) {
        return d3_time_formatPad(d.getDate(), p, 2);
      },
      e: function(d, p) {
        return d3_time_formatPad(d.getDate(), p, 2);
      },
      H: function(d, p) {
        return d3_time_formatPad(d.getHours(), p, 2);
      },
      I: function(d, p) {
        return d3_time_formatPad(d.getHours() % 12 || 12, p, 2);
      },
      j: function(d, p) {
        return d3_time_formatPad(1 + d3_time.dayOfYear(d), p, 3);
      },
      L: function(d, p) {
        return d3_time_formatPad(d.getMilliseconds(), p, 3);
      },
      m: function(d, p) {
        return d3_time_formatPad(d.getMonth() + 1, p, 2);
      },
      M: function(d, p) {
        return d3_time_formatPad(d.getMinutes(), p, 2);
      },
      p: function(d) {
        return locale_periods[+(d.getHours() >= 12)];
      },
      S: function(d, p) {
        return d3_time_formatPad(d.getSeconds(), p, 2);
      },
      U: function(d, p) {
        return d3_time_formatPad(d3_time.sundayOfYear(d), p, 2);
      },
      w: function(d) {
        return d.getDay();
      },
      W: function(d, p) {
        return d3_time_formatPad(d3_time.mondayOfYear(d), p, 2);
      },
      x: d3_time_format(locale_date),
      X: d3_time_format(locale_time),
      y: function(d, p) {
        return d3_time_formatPad(d.getFullYear() % 100, p, 2);
      },
      Y: function(d, p) {
        return d3_time_formatPad(d.getFullYear() % 1e4, p, 4);
      },
      Z: d3_time_zone,
      "%": function() {
        return "%";
      }
    };
    var d3_time_parsers = {
      a: d3_time_parseWeekdayAbbrev,
      A: d3_time_parseWeekday,
      b: d3_time_parseMonthAbbrev,
      B: d3_time_parseMonth,
      c: d3_time_parseLocaleFull,
      d: d3_time_parseDay,
      e: d3_time_parseDay,
      H: d3_time_parseHour24,
      I: d3_time_parseHour24,
      j: d3_time_parseDayOfYear,
      L: d3_time_parseMilliseconds,
      m: d3_time_parseMonthNumber,
      M: d3_time_parseMinutes,
      p: d3_time_parseAmPm,
      S: d3_time_parseSeconds,
      U: d3_time_parseWeekNumberSunday,
      w: d3_time_parseWeekdayNumber,
      W: d3_time_parseWeekNumberMonday,
      x: d3_time_parseLocaleDate,
      X: d3_time_parseLocaleTime,
      y: d3_time_parseYear,
      Y: d3_time_parseFullYear,
      Z: d3_time_parseZone,
      "%": d3_time_parseLiteralPercent
    };
    function d3_time_parseWeekdayAbbrev(date, string, i) {
      d3_time_dayAbbrevRe.lastIndex = 0;
      var n = d3_time_dayAbbrevRe.exec(string.slice(i));
      return n ? (date.w = d3_time_dayAbbrevLookup.get(n[0].toLowerCase()), i + n[0].length) : -1;
    }
    function d3_time_parseWeekday(date, string, i) {
      d3_time_dayRe.lastIndex = 0;
      var n = d3_time_dayRe.exec(string.slice(i));
      return n ? (date.w = d3_time_dayLookup.get(n[0].toLowerCase()), i + n[0].length) : -1;
    }
    function d3_time_parseMonthAbbrev(date, string, i) {
      d3_time_monthAbbrevRe.lastIndex = 0;
      var n = d3_time_monthAbbrevRe.exec(string.slice(i));
      return n ? (date.m = d3_time_monthAbbrevLookup.get(n[0].toLowerCase()), i + n[0].length) : -1;
    }
    function d3_time_parseMonth(date, string, i) {
      d3_time_monthRe.lastIndex = 0;
      var n = d3_time_monthRe.exec(string.slice(i));
      return n ? (date.m = d3_time_monthLookup.get(n[0].toLowerCase()), i + n[0].length) : -1;
    }
    function d3_time_parseLocaleFull(date, string, i) {
      return d3_time_parse(date, d3_time_formats.c.toString(), string, i);
    }
    function d3_time_parseLocaleDate(date, string, i) {
      return d3_time_parse(date, d3_time_formats.x.toString(), string, i);
    }
    function d3_time_parseLocaleTime(date, string, i) {
      return d3_time_parse(date, d3_time_formats.X.toString(), string, i);
    }
    function d3_time_parseAmPm(date, string, i) {
      var n = d3_time_periodLookup.get(string.slice(i, i += 2).toLowerCase());
      return n == null ? -1 : (date.p = n, i);
    }
    return d3_time_format;
  }
  var d3_time_formatPads = {
    "-": "",
    _: " ",
    "0": "0"
  }, d3_time_numberRe = /^\s*\d+/, d3_time_percentRe = /^%/;
  function d3_time_formatPad(value, fill, width) {
    var sign = value < 0 ? "-" : "", string = (sign ? -value : value) + "", length = string.length;
    return sign + (length < width ? new Array(width - length + 1).join(fill) + string : string);
  }
  function d3_time_formatRe(names) {
    return new RegExp("^(?:" + names.map(d3.requote).join("|") + ")", "i");
  }
  function d3_time_formatLookup(names) {
    var map = new d3_Map(), i = -1, n = names.length;
    while (++i < n) map.set(names[i].toLowerCase(), i);
    return map;
  }
  function d3_time_parseWeekdayNumber(date, string, i) {
    d3_time_numberRe.lastIndex = 0;
    var n = d3_time_numberRe.exec(string.slice(i, i + 1));
    return n ? (date.w = +n[0], i + n[0].length) : -1;
  }
  function d3_time_parseWeekNumberSunday(date, string, i) {
    d3_time_numberRe.lastIndex = 0;
    var n = d3_time_numberRe.exec(string.slice(i));
    return n ? (date.U = +n[0], i + n[0].length) : -1;
  }
  function d3_time_parseWeekNumberMonday(date, string, i) {
    d3_time_numberRe.lastIndex = 0;
    var n = d3_time_numberRe.exec(string.slice(i));
    return n ? (date.W = +n[0], i + n[0].length) : -1;
  }
  function d3_time_parseFullYear(date, string, i) {
    d3_time_numberRe.lastIndex = 0;
    var n = d3_time_numberRe.exec(string.slice(i, i + 4));
    return n ? (date.y = +n[0], i + n[0].length) : -1;
  }
  function d3_time_parseYear(date, string, i) {
    d3_time_numberRe.lastIndex = 0;
    var n = d3_time_numberRe.exec(string.slice(i, i + 2));
    return n ? (date.y = d3_time_expandYear(+n[0]), i + n[0].length) : -1;
  }
  function d3_time_parseZone(date, string, i) {
    return /^[+-]\d{4}$/.test(string = string.slice(i, i + 5)) ? (date.Z = -string, 
    i + 5) : -1;
  }
  function d3_time_expandYear(d) {
    return d + (d > 68 ? 1900 : 2e3);
  }
  function d3_time_parseMonthNumber(date, string, i) {
    d3_time_numberRe.lastIndex = 0;
    var n = d3_time_numberRe.exec(string.slice(i, i + 2));
    return n ? (date.m = n[0] - 1, i + n[0].length) : -1;
  }
  function d3_time_parseDay(date, string, i) {
    d3_time_numberRe.lastIndex = 0;
    var n = d3_time_numberRe.exec(string.slice(i, i + 2));
    return n ? (date.d = +n[0], i + n[0].length) : -1;
  }
  function d3_time_parseDayOfYear(date, string, i) {
    d3_time_numberRe.lastIndex = 0;
    var n = d3_time_numberRe.exec(string.slice(i, i + 3));
    return n ? (date.j = +n[0], i + n[0].length) : -1;
  }
  function d3_time_parseHour24(date, string, i) {
    d3_time_numberRe.lastIndex = 0;
    var n = d3_time_numberRe.exec(string.slice(i, i + 2));
    return n ? (date.H = +n[0], i + n[0].length) : -1;
  }
  function d3_time_parseMinutes(date, string, i) {
    d3_time_numberRe.lastIndex = 0;
    var n = d3_time_numberRe.exec(string.slice(i, i + 2));
    return n ? (date.M = +n[0], i + n[0].length) : -1;
  }
  function d3_time_parseSeconds(date, string, i) {
    d3_time_numberRe.lastIndex = 0;
    var n = d3_time_numberRe.exec(string.slice(i, i + 2));
    return n ? (date.S = +n[0], i + n[0].length) : -1;
  }
  function d3_time_parseMilliseconds(date, string, i) {
    d3_time_numberRe.lastIndex = 0;
    var n = d3_time_numberRe.exec(string.slice(i, i + 3));
    return n ? (date.L = +n[0], i + n[0].length) : -1;
  }
  function d3_time_zone(d) {
    var z = d.getTimezoneOffset(), zs = z > 0 ? "-" : "+", zh = abs(z) / 60 | 0, zm = abs(z) % 60;
    return zs + d3_time_formatPad(zh, "0", 2) + d3_time_formatPad(zm, "0", 2);
  }
  function d3_time_parseLiteralPercent(date, string, i) {
    d3_time_percentRe.lastIndex = 0;
    var n = d3_time_percentRe.exec(string.slice(i, i + 1));
    return n ? i + n[0].length : -1;
  }
  function d3_time_formatMulti(formats) {
    var n = formats.length, i = -1;
    while (++i < n) formats[i][0] = this(formats[i][0]);
    return function(date) {
      var i = 0, f = formats[i];
      while (!f[1](date)) f = formats[++i];
      return f[0](date);
    };
  }
  d3.locale = function(locale) {
    return {
      numberFormat: d3_locale_numberFormat(locale),
      timeFormat: d3_locale_timeFormat(locale)
    };
  };
  var d3_locale_enUS = d3.locale({
    decimal: ".",
    thousands: ",",
    grouping: [ 3 ],
    currency: [ "$", "" ],
    dateTime: "%a %b %e %X %Y",
    date: "%m/%d/%Y",
    time: "%H:%M:%S",
    periods: [ "AM", "PM" ],
    days: [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ],
    shortDays: [ "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" ],
    months: [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ],
    shortMonths: [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ]
  });
  d3.format = d3_locale_enUS.numberFormat;
  d3.geo = {};
  function d3_adder() {}
  d3_adder.prototype = {
    s: 0,
    t: 0,
    add: function(y) {
      d3_adderSum(y, this.t, d3_adderTemp);
      d3_adderSum(d3_adderTemp.s, this.s, this);
      if (this.s) this.t += d3_adderTemp.t; else this.s = d3_adderTemp.t;
    },
    reset: function() {
      this.s = this.t = 0;
    },
    valueOf: function() {
      return this.s;
    }
  };
  var d3_adderTemp = new d3_adder();
  function d3_adderSum(a, b, o) {
    var x = o.s = a + b, bv = x - a, av = x - bv;
    o.t = a - av + (b - bv);
  }
  d3.geo.stream = function(object, listener) {
    if (object && d3_geo_streamObjectType.hasOwnProperty(object.type)) {
      d3_geo_streamObjectType[object.type](object, listener);
    } else {
      d3_geo_streamGeometry(object, listener);
    }
  };
  function d3_geo_streamGeometry(geometry, listener) {
    if (geometry && d3_geo_streamGeometryType.hasOwnProperty(geometry.type)) {
      d3_geo_streamGeometryType[geometry.type](geometry, listener);
    }
  }
  var d3_geo_streamObjectType = {
    Feature: function(feature, listener) {
      d3_geo_streamGeometry(feature.geometry, listener);
    },
    FeatureCollection: function(object, listener) {
      var features = object.features, i = -1, n = features.length;
      while (++i < n) d3_geo_streamGeometry(features[i].geometry, listener);
    }
  };
  var d3_geo_streamGeometryType = {
    Sphere: function(object, listener) {
      listener.sphere();
    },
    Point: function(object, listener) {
      object = object.coordinates;
      listener.point(object[0], object[1], object[2]);
    },
    MultiPoint: function(object, listener) {
      var coordinates = object.coordinates, i = -1, n = coordinates.length;
      while (++i < n) object = coordinates[i], listener.point(object[0], object[1], object[2]);
    },
    LineString: function(object, listener) {
      d3_geo_streamLine(object.coordinates, listener, 0);
    },
    MultiLineString: function(object, listener) {
      var coordinates = object.coordinates, i = -1, n = coordinates.length;
      while (++i < n) d3_geo_streamLine(coordinates[i], listener, 0);
    },
    Polygon: function(object, listener) {
      d3_geo_streamPolygon(object.coordinates, listener);
    },
    MultiPolygon: function(object, listener) {
      var coordinates = object.coordinates, i = -1, n = coordinates.length;
      while (++i < n) d3_geo_streamPolygon(coordinates[i], listener);
    },
    GeometryCollection: function(object, listener) {
      var geometries = object.geometries, i = -1, n = geometries.length;
      while (++i < n) d3_geo_streamGeometry(geometries[i], listener);
    }
  };
  function d3_geo_streamLine(coordinates, listener, closed) {
    var i = -1, n = coordinates.length - closed, coordinate;
    listener.lineStart();
    while (++i < n) coordinate = coordinates[i], listener.point(coordinate[0], coordinate[1], coordinate[2]);
    listener.lineEnd();
  }
  function d3_geo_streamPolygon(coordinates, listener) {
    var i = -1, n = coordinates.length;
    listener.polygonStart();
    while (++i < n) d3_geo_streamLine(coordinates[i], listener, 1);
    listener.polygonEnd();
  }
  d3.geo.area = function(object) {
    d3_geo_areaSum = 0;
    d3.geo.stream(object, d3_geo_area);
    return d3_geo_areaSum;
  };
  var d3_geo_areaSum, d3_geo_areaRingSum = new d3_adder();
  var d3_geo_area = {
    sphere: function() {
      d3_geo_areaSum += 4 * π;
    },
    point: d3_noop,
    lineStart: d3_noop,
    lineEnd: d3_noop,
    polygonStart: function() {
      d3_geo_areaRingSum.reset();
      d3_geo_area.lineStart = d3_geo_areaRingStart;
    },
    polygonEnd: function() {
      var area = 2 * d3_geo_areaRingSum;
      d3_geo_areaSum += area < 0 ? 4 * π + area : area;
      d3_geo_area.lineStart = d3_geo_area.lineEnd = d3_geo_area.point = d3_noop;
    }
  };
  function d3_geo_areaRingStart() {
    var λ00, φ00, λ0, cosφ0, sinφ0;
    d3_geo_area.point = function(λ, φ) {
      d3_geo_area.point = nextPoint;
      λ0 = (λ00 = λ) * d3_radians, cosφ0 = Math.cos(φ = (φ00 = φ) * d3_radians / 2 + π / 4), 
      sinφ0 = Math.sin(φ);
    };
    function nextPoint(λ, φ) {
      λ *= d3_radians;
      φ = φ * d3_radians / 2 + π / 4;
      var dλ = λ - λ0, sdλ = dλ >= 0 ? 1 : -1, adλ = sdλ * dλ, cosφ = Math.cos(φ), sinφ = Math.sin(φ), k = sinφ0 * sinφ, u = cosφ0 * cosφ + k * Math.cos(adλ), v = k * sdλ * Math.sin(adλ);
      d3_geo_areaRingSum.add(Math.atan2(v, u));
      λ0 = λ, cosφ0 = cosφ, sinφ0 = sinφ;
    }
    d3_geo_area.lineEnd = function() {
      nextPoint(λ00, φ00);
    };
  }
  function d3_geo_cartesian(spherical) {
    var λ = spherical[0], φ = spherical[1], cosφ = Math.cos(φ);
    return [ cosφ * Math.cos(λ), cosφ * Math.sin(λ), Math.sin(φ) ];
  }
  function d3_geo_cartesianDot(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  }
  function d3_geo_cartesianCross(a, b) {
    return [ a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0] ];
  }
  function d3_geo_cartesianAdd(a, b) {
    a[0] += b[0];
    a[1] += b[1];
    a[2] += b[2];
  }
  function d3_geo_cartesianScale(vector, k) {
    return [ vector[0] * k, vector[1] * k, vector[2] * k ];
  }
  function d3_geo_cartesianNormalize(d) {
    var l = Math.sqrt(d[0] * d[0] + d[1] * d[1] + d[2] * d[2]);
    d[0] /= l;
    d[1] /= l;
    d[2] /= l;
  }
  function d3_geo_spherical(cartesian) {
    return [ Math.atan2(cartesian[1], cartesian[0]), d3_asin(cartesian[2]) ];
  }
  function d3_geo_sphericalEqual(a, b) {
    return abs(a[0] - b[0]) < ε && abs(a[1] - b[1]) < ε;
  }
  d3.geo.bounds = function() {
    var λ0, φ0, λ1, φ1, λ_, λ__, φ__, p0, dλSum, ranges, range;
    var bound = {
      point: point,
      lineStart: lineStart,
      lineEnd: lineEnd,
      polygonStart: function() {
        bound.point = ringPoint;
        bound.lineStart = ringStart;
        bound.lineEnd = ringEnd;
        dλSum = 0;
        d3_geo_area.polygonStart();
      },
      polygonEnd: function() {
        d3_geo_area.polygonEnd();
        bound.point = point;
        bound.lineStart = lineStart;
        bound.lineEnd = lineEnd;
        if (d3_geo_areaRingSum < 0) λ0 = -(λ1 = 180), φ0 = -(φ1 = 90); else if (dλSum > ε) φ1 = 90; else if (dλSum < -ε) φ0 = -90;
        range[0] = λ0, range[1] = λ1;
      }
    };
    function point(λ, φ) {
      ranges.push(range = [ λ0 = λ, λ1 = λ ]);
      if (φ < φ0) φ0 = φ;
      if (φ > φ1) φ1 = φ;
    }
    function linePoint(λ, φ) {
      var p = d3_geo_cartesian([ λ * d3_radians, φ * d3_radians ]);
      if (p0) {
        var normal = d3_geo_cartesianCross(p0, p), equatorial = [ normal[1], -normal[0], 0 ], inflection = d3_geo_cartesianCross(equatorial, normal);
        d3_geo_cartesianNormalize(inflection);
        inflection = d3_geo_spherical(inflection);
        var dλ = λ - λ_, s = dλ > 0 ? 1 : -1, λi = inflection[0] * d3_degrees * s, antimeridian = abs(dλ) > 180;
        if (antimeridian ^ (s * λ_ < λi && λi < s * λ)) {
          var φi = inflection[1] * d3_degrees;
          if (φi > φ1) φ1 = φi;
        } else if (λi = (λi + 360) % 360 - 180, antimeridian ^ (s * λ_ < λi && λi < s * λ)) {
          var φi = -inflection[1] * d3_degrees;
          if (φi < φ0) φ0 = φi;
        } else {
          if (φ < φ0) φ0 = φ;
          if (φ > φ1) φ1 = φ;
        }
        if (antimeridian) {
          if (λ < λ_) {
            if (angle(λ0, λ) > angle(λ0, λ1)) λ1 = λ;
          } else {
            if (angle(λ, λ1) > angle(λ0, λ1)) λ0 = λ;
          }
        } else {
          if (λ1 >= λ0) {
            if (λ < λ0) λ0 = λ;
            if (λ > λ1) λ1 = λ;
          } else {
            if (λ > λ_) {
              if (angle(λ0, λ) > angle(λ0, λ1)) λ1 = λ;
            } else {
              if (angle(λ, λ1) > angle(λ0, λ1)) λ0 = λ;
            }
          }
        }
      } else {
        point(λ, φ);
      }
      p0 = p, λ_ = λ;
    }
    function lineStart() {
      bound.point = linePoint;
    }
    function lineEnd() {
      range[0] = λ0, range[1] = λ1;
      bound.point = point;
      p0 = null;
    }
    function ringPoint(λ, φ) {
      if (p0) {
        var dλ = λ - λ_;
        dλSum += abs(dλ) > 180 ? dλ + (dλ > 0 ? 360 : -360) : dλ;
      } else λ__ = λ, φ__ = φ;
      d3_geo_area.point(λ, φ);
      linePoint(λ, φ);
    }
    function ringStart() {
      d3_geo_area.lineStart();
    }
    function ringEnd() {
      ringPoint(λ__, φ__);
      d3_geo_area.lineEnd();
      if (abs(dλSum) > ε) λ0 = -(λ1 = 180);
      range[0] = λ0, range[1] = λ1;
      p0 = null;
    }
    function angle(λ0, λ1) {
      return (λ1 -= λ0) < 0 ? λ1 + 360 : λ1;
    }
    function compareRanges(a, b) {
      return a[0] - b[0];
    }
    function withinRange(x, range) {
      return range[0] <= range[1] ? range[0] <= x && x <= range[1] : x < range[0] || range[1] < x;
    }
    return function(feature) {
      φ1 = λ1 = -(λ0 = φ0 = Infinity);
      ranges = [];
      d3.geo.stream(feature, bound);
      var n = ranges.length;
      if (n) {
        ranges.sort(compareRanges);
        for (var i = 1, a = ranges[0], b, merged = [ a ]; i < n; ++i) {
          b = ranges[i];
          if (withinRange(b[0], a) || withinRange(b[1], a)) {
            if (angle(a[0], b[1]) > angle(a[0], a[1])) a[1] = b[1];
            if (angle(b[0], a[1]) > angle(a[0], a[1])) a[0] = b[0];
          } else {
            merged.push(a = b);
          }
        }
        var best = -Infinity, dλ;
        for (var n = merged.length - 1, i = 0, a = merged[n], b; i <= n; a = b, ++i) {
          b = merged[i];
          if ((dλ = angle(a[1], b[0])) > best) best = dλ, λ0 = b[0], λ1 = a[1];
        }
      }
      ranges = range = null;
      return λ0 === Infinity || φ0 === Infinity ? [ [ NaN, NaN ], [ NaN, NaN ] ] : [ [ λ0, φ0 ], [ λ1, φ1 ] ];
    };
  }();
  d3.geo.centroid = function(object) {
    d3_geo_centroidW0 = d3_geo_centroidW1 = d3_geo_centroidX0 = d3_geo_centroidY0 = d3_geo_centroidZ0 = d3_geo_centroidX1 = d3_geo_centroidY1 = d3_geo_centroidZ1 = d3_geo_centroidX2 = d3_geo_centroidY2 = d3_geo_centroidZ2 = 0;
    d3.geo.stream(object, d3_geo_centroid);
    var x = d3_geo_centroidX2, y = d3_geo_centroidY2, z = d3_geo_centroidZ2, m = x * x + y * y + z * z;
    if (m < ε2) {
      x = d3_geo_centroidX1, y = d3_geo_centroidY1, z = d3_geo_centroidZ1;
      if (d3_geo_centroidW1 < ε) x = d3_geo_centroidX0, y = d3_geo_centroidY0, z = d3_geo_centroidZ0;
      m = x * x + y * y + z * z;
      if (m < ε2) return [ NaN, NaN ];
    }
    return [ Math.atan2(y, x) * d3_degrees, d3_asin(z / Math.sqrt(m)) * d3_degrees ];
  };
  var d3_geo_centroidW0, d3_geo_centroidW1, d3_geo_centroidX0, d3_geo_centroidY0, d3_geo_centroidZ0, d3_geo_centroidX1, d3_geo_centroidY1, d3_geo_centroidZ1, d3_geo_centroidX2, d3_geo_centroidY2, d3_geo_centroidZ2;
  var d3_geo_centroid = {
    sphere: d3_noop,
    point: d3_geo_centroidPoint,
    lineStart: d3_geo_centroidLineStart,
    lineEnd: d3_geo_centroidLineEnd,
    polygonStart: function() {
      d3_geo_centroid.lineStart = d3_geo_centroidRingStart;
    },
    polygonEnd: function() {
      d3_geo_centroid.lineStart = d3_geo_centroidLineStart;
    }
  };
  function d3_geo_centroidPoint(λ, φ) {
    λ *= d3_radians;
    var cosφ = Math.cos(φ *= d3_radians);
    d3_geo_centroidPointXYZ(cosφ * Math.cos(λ), cosφ * Math.sin(λ), Math.sin(φ));
  }
  function d3_geo_centroidPointXYZ(x, y, z) {
    ++d3_geo_centroidW0;
    d3_geo_centroidX0 += (x - d3_geo_centroidX0) / d3_geo_centroidW0;
    d3_geo_centroidY0 += (y - d3_geo_centroidY0) / d3_geo_centroidW0;
    d3_geo_centroidZ0 += (z - d3_geo_centroidZ0) / d3_geo_centroidW0;
  }
  function d3_geo_centroidLineStart() {
    var x0, y0, z0;
    d3_geo_centroid.point = function(λ, φ) {
      λ *= d3_radians;
      var cosφ = Math.cos(φ *= d3_radians);
      x0 = cosφ * Math.cos(λ);
      y0 = cosφ * Math.sin(λ);
      z0 = Math.sin(φ);
      d3_geo_centroid.point = nextPoint;
      d3_geo_centroidPointXYZ(x0, y0, z0);
    };
    function nextPoint(λ, φ) {
      λ *= d3_radians;
      var cosφ = Math.cos(φ *= d3_radians), x = cosφ * Math.cos(λ), y = cosφ * Math.sin(λ), z = Math.sin(φ), w = Math.atan2(Math.sqrt((w = y0 * z - z0 * y) * w + (w = z0 * x - x0 * z) * w + (w = x0 * y - y0 * x) * w), x0 * x + y0 * y + z0 * z);
      d3_geo_centroidW1 += w;
      d3_geo_centroidX1 += w * (x0 + (x0 = x));
      d3_geo_centroidY1 += w * (y0 + (y0 = y));
      d3_geo_centroidZ1 += w * (z0 + (z0 = z));
      d3_geo_centroidPointXYZ(x0, y0, z0);
    }
  }
  function d3_geo_centroidLineEnd() {
    d3_geo_centroid.point = d3_geo_centroidPoint;
  }
  function d3_geo_centroidRingStart() {
    var λ00, φ00, x0, y0, z0;
    d3_geo_centroid.point = function(λ, φ) {
      λ00 = λ, φ00 = φ;
      d3_geo_centroid.point = nextPoint;
      λ *= d3_radians;
      var cosφ = Math.cos(φ *= d3_radians);
      x0 = cosφ * Math.cos(λ);
      y0 = cosφ * Math.sin(λ);
      z0 = Math.sin(φ);
      d3_geo_centroidPointXYZ(x0, y0, z0);
    };
    d3_geo_centroid.lineEnd = function() {
      nextPoint(λ00, φ00);
      d3_geo_centroid.lineEnd = d3_geo_centroidLineEnd;
      d3_geo_centroid.point = d3_geo_centroidPoint;
    };
    function nextPoint(λ, φ) {
      λ *= d3_radians;
      var cosφ = Math.cos(φ *= d3_radians), x = cosφ * Math.cos(λ), y = cosφ * Math.sin(λ), z = Math.sin(φ), cx = y0 * z - z0 * y, cy = z0 * x - x0 * z, cz = x0 * y - y0 * x, m = Math.sqrt(cx * cx + cy * cy + cz * cz), u = x0 * x + y0 * y + z0 * z, v = m && -d3_acos(u) / m, w = Math.atan2(m, u);
      d3_geo_centroidX2 += v * cx;
      d3_geo_centroidY2 += v * cy;
      d3_geo_centroidZ2 += v * cz;
      d3_geo_centroidW1 += w;
      d3_geo_centroidX1 += w * (x0 + (x0 = x));
      d3_geo_centroidY1 += w * (y0 + (y0 = y));
      d3_geo_centroidZ1 += w * (z0 + (z0 = z));
      d3_geo_centroidPointXYZ(x0, y0, z0);
    }
  }
  function d3_geo_compose(a, b) {
    function compose(x, y) {
      return x = a(x, y), b(x[0], x[1]);
    }
    if (a.invert && b.invert) compose.invert = function(x, y) {
      return x = b.invert(x, y), x && a.invert(x[0], x[1]);
    };
    return compose;
  }
  function d3_true() {
    return true;
  }
  function d3_geo_clipPolygon(segments, compare, clipStartInside, interpolate, listener) {
    var subject = [], clip = [];
    segments.forEach(function(segment) {
      if ((n = segment.length - 1) <= 0) return;
      var n, p0 = segment[0], p1 = segment[n];
      if (d3_geo_sphericalEqual(p0, p1)) {
        listener.lineStart();
        for (var i = 0; i < n; ++i) listener.point((p0 = segment[i])[0], p0[1]);
        listener.lineEnd();
        return;
      }
      var a = new d3_geo_clipPolygonIntersection(p0, segment, null, true), b = new d3_geo_clipPolygonIntersection(p0, null, a, false);
      a.o = b;
      subject.push(a);
      clip.push(b);
      a = new d3_geo_clipPolygonIntersection(p1, segment, null, false);
      b = new d3_geo_clipPolygonIntersection(p1, null, a, true);
      a.o = b;
      subject.push(a);
      clip.push(b);
    });
    clip.sort(compare);
    d3_geo_clipPolygonLinkCircular(subject);
    d3_geo_clipPolygonLinkCircular(clip);
    if (!subject.length) return;
    for (var i = 0, entry = clipStartInside, n = clip.length; i < n; ++i) {
      clip[i].e = entry = !entry;
    }
    var start = subject[0], points, point;
    while (1) {
      var current = start, isSubject = true;
      while (current.v) if ((current = current.n) === start) return;
      points = current.z;
      listener.lineStart();
      do {
        current.v = current.o.v = true;
        if (current.e) {
          if (isSubject) {
            for (var i = 0, n = points.length; i < n; ++i) listener.point((point = points[i])[0], point[1]);
          } else {
            interpolate(current.x, current.n.x, 1, listener);
          }
          current = current.n;
        } else {
          if (isSubject) {
            points = current.p.z;
            for (var i = points.length - 1; i >= 0; --i) listener.point((point = points[i])[0], point[1]);
          } else {
            interpolate(current.x, current.p.x, -1, listener);
          }
          current = current.p;
        }
        current = current.o;
        points = current.z;
        isSubject = !isSubject;
      } while (!current.v);
      listener.lineEnd();
    }
  }
  function d3_geo_clipPolygonLinkCircular(array) {
    if (!(n = array.length)) return;
    var n, i = 0, a = array[0], b;
    while (++i < n) {
      a.n = b = array[i];
      b.p = a;
      a = b;
    }
    a.n = b = array[0];
    b.p = a;
  }
  function d3_geo_clipPolygonIntersection(point, points, other, entry) {
    this.x = point;
    this.z = points;
    this.o = other;
    this.e = entry;
    this.v = false;
    this.n = this.p = null;
  }
  function d3_geo_clip(pointVisible, clipLine, interpolate, clipStart) {
    return function(rotate, listener) {
      var line = clipLine(listener), rotatedClipStart = rotate.invert(clipStart[0], clipStart[1]);
      var clip = {
        point: point,
        lineStart: lineStart,
        lineEnd: lineEnd,
        polygonStart: function() {
          clip.point = pointRing;
          clip.lineStart = ringStart;
          clip.lineEnd = ringEnd;
          segments = [];
          polygon = [];
        },
        polygonEnd: function() {
          clip.point = point;
          clip.lineStart = lineStart;
          clip.lineEnd = lineEnd;
          segments = d3.merge(segments);
          var clipStartInside = d3_geo_pointInPolygon(rotatedClipStart, polygon);
          if (segments.length) {
            if (!polygonStarted) listener.polygonStart(), polygonStarted = true;
            d3_geo_clipPolygon(segments, d3_geo_clipSort, clipStartInside, interpolate, listener);
          } else if (clipStartInside) {
            if (!polygonStarted) listener.polygonStart(), polygonStarted = true;
            listener.lineStart();
            interpolate(null, null, 1, listener);
            listener.lineEnd();
          }
          if (polygonStarted) listener.polygonEnd(), polygonStarted = false;
          segments = polygon = null;
        },
        sphere: function() {
          listener.polygonStart();
          listener.lineStart();
          interpolate(null, null, 1, listener);
          listener.lineEnd();
          listener.polygonEnd();
        }
      };
      function point(λ, φ) {
        var point = rotate(λ, φ);
        if (pointVisible(λ = point[0], φ = point[1])) listener.point(λ, φ);
      }
      function pointLine(λ, φ) {
        var point = rotate(λ, φ);
        line.point(point[0], point[1]);
      }
      function lineStart() {
        clip.point = pointLine;
        line.lineStart();
      }
      function lineEnd() {
        clip.point = point;
        line.lineEnd();
      }
      var segments;
      var buffer = d3_geo_clipBufferListener(), ringListener = clipLine(buffer), polygonStarted = false, polygon, ring;
      function pointRing(λ, φ) {
        ring.push([ λ, φ ]);
        var point = rotate(λ, φ);
        ringListener.point(point[0], point[1]);
      }
      function ringStart() {
        ringListener.lineStart();
        ring = [];
      }
      function ringEnd() {
        pointRing(ring[0][0], ring[0][1]);
        ringListener.lineEnd();
        var clean = ringListener.clean(), ringSegments = buffer.buffer(), segment, n = ringSegments.length;
        ring.pop();
        polygon.push(ring);
        ring = null;
        if (!n) return;
        if (clean & 1) {
          segment = ringSegments[0];
          var n = segment.length - 1, i = -1, point;
          if (n > 0) {
            if (!polygonStarted) listener.polygonStart(), polygonStarted = true;
            listener.lineStart();
            while (++i < n) listener.point((point = segment[i])[0], point[1]);
            listener.lineEnd();
          }
          return;
        }
        if (n > 1 && clean & 2) ringSegments.push(ringSegments.pop().concat(ringSegments.shift()));
        segments.push(ringSegments.filter(d3_geo_clipSegmentLength1));
      }
      return clip;
    };
  }
  function d3_geo_clipSegmentLength1(segment) {
    return segment.length > 1;
  }
  function d3_geo_clipBufferListener() {
    var lines = [], line;
    return {
      lineStart: function() {
        lines.push(line = []);
      },
      point: function(λ, φ) {
        line.push([ λ, φ ]);
      },
      lineEnd: d3_noop,
      buffer: function() {
        var buffer = lines;
        lines = [];
        line = null;
        return buffer;
      },
      rejoin: function() {
        if (lines.length > 1) lines.push(lines.pop().concat(lines.shift()));
      }
    };
  }
  function d3_geo_clipSort(a, b) {
    return ((a = a.x)[0] < 0 ? a[1] - halfπ - ε : halfπ - a[1]) - ((b = b.x)[0] < 0 ? b[1] - halfπ - ε : halfπ - b[1]);
  }
  var d3_geo_clipAntimeridian = d3_geo_clip(d3_true, d3_geo_clipAntimeridianLine, d3_geo_clipAntimeridianInterpolate, [ -π, -π / 2 ]);
  function d3_geo_clipAntimeridianLine(listener) {
    var λ0 = NaN, φ0 = NaN, sλ0 = NaN, clean;
    return {
      lineStart: function() {
        listener.lineStart();
        clean = 1;
      },
      point: function(λ1, φ1) {
        var sλ1 = λ1 > 0 ? π : -π, dλ = abs(λ1 - λ0);
        if (abs(dλ - π) < ε) {
          listener.point(λ0, φ0 = (φ0 + φ1) / 2 > 0 ? halfπ : -halfπ);
          listener.point(sλ0, φ0);
          listener.lineEnd();
          listener.lineStart();
          listener.point(sλ1, φ0);
          listener.point(λ1, φ0);
          clean = 0;
        } else if (sλ0 !== sλ1 && dλ >= π) {
          if (abs(λ0 - sλ0) < ε) λ0 -= sλ0 * ε;
          if (abs(λ1 - sλ1) < ε) λ1 -= sλ1 * ε;
          φ0 = d3_geo_clipAntimeridianIntersect(λ0, φ0, λ1, φ1);
          listener.point(sλ0, φ0);
          listener.lineEnd();
          listener.lineStart();
          listener.point(sλ1, φ0);
          clean = 0;
        }
        listener.point(λ0 = λ1, φ0 = φ1);
        sλ0 = sλ1;
      },
      lineEnd: function() {
        listener.lineEnd();
        λ0 = φ0 = NaN;
      },
      clean: function() {
        return 2 - clean;
      }
    };
  }
  function d3_geo_clipAntimeridianIntersect(λ0, φ0, λ1, φ1) {
    var cosφ0, cosφ1, sinλ0_λ1 = Math.sin(λ0 - λ1);
    return abs(sinλ0_λ1) > ε ? Math.atan((Math.sin(φ0) * (cosφ1 = Math.cos(φ1)) * Math.sin(λ1) - Math.sin(φ1) * (cosφ0 = Math.cos(φ0)) * Math.sin(λ0)) / (cosφ0 * cosφ1 * sinλ0_λ1)) : (φ0 + φ1) / 2;
  }
  function d3_geo_clipAntimeridianInterpolate(from, to, direction, listener) {
    var φ;
    if (from == null) {
      φ = direction * halfπ;
      listener.point(-π, φ);
      listener.point(0, φ);
      listener.point(π, φ);
      listener.point(π, 0);
      listener.point(π, -φ);
      listener.point(0, -φ);
      listener.point(-π, -φ);
      listener.point(-π, 0);
      listener.point(-π, φ);
    } else if (abs(from[0] - to[0]) > ε) {
      var s = from[0] < to[0] ? π : -π;
      φ = direction * s / 2;
      listener.point(-s, φ);
      listener.point(0, φ);
      listener.point(s, φ);
    } else {
      listener.point(to[0], to[1]);
    }
  }
  function d3_geo_pointInPolygon(point, polygon) {
    var meridian = point[0], parallel = point[1], meridianNormal = [ Math.sin(meridian), -Math.cos(meridian), 0 ], polarAngle = 0, winding = 0;
    d3_geo_areaRingSum.reset();
    for (var i = 0, n = polygon.length; i < n; ++i) {
      var ring = polygon[i], m = ring.length;
      if (!m) continue;
      var point0 = ring[0], λ0 = point0[0], φ0 = point0[1] / 2 + π / 4, sinφ0 = Math.sin(φ0), cosφ0 = Math.cos(φ0), j = 1;
      while (true) {
        if (j === m) j = 0;
        point = ring[j];
        var λ = point[0], φ = point[1] / 2 + π / 4, sinφ = Math.sin(φ), cosφ = Math.cos(φ), dλ = λ - λ0, sdλ = dλ >= 0 ? 1 : -1, adλ = sdλ * dλ, antimeridian = adλ > π, k = sinφ0 * sinφ;
        d3_geo_areaRingSum.add(Math.atan2(k * sdλ * Math.sin(adλ), cosφ0 * cosφ + k * Math.cos(adλ)));
        polarAngle += antimeridian ? dλ + sdλ * τ : dλ;
        if (antimeridian ^ λ0 >= meridian ^ λ >= meridian) {
          var arc = d3_geo_cartesianCross(d3_geo_cartesian(point0), d3_geo_cartesian(point));
          d3_geo_cartesianNormalize(arc);
          var intersection = d3_geo_cartesianCross(meridianNormal, arc);
          d3_geo_cartesianNormalize(intersection);
          var φarc = (antimeridian ^ dλ >= 0 ? -1 : 1) * d3_asin(intersection[2]);
          if (parallel > φarc || parallel === φarc && (arc[0] || arc[1])) {
            winding += antimeridian ^ dλ >= 0 ? 1 : -1;
          }
        }
        if (!j++) break;
        λ0 = λ, sinφ0 = sinφ, cosφ0 = cosφ, point0 = point;
      }
    }
    return (polarAngle < -ε || polarAngle < ε && d3_geo_areaRingSum < 0) ^ winding & 1;
  }
  function d3_geo_clipCircle(radius) {
    var cr = Math.cos(radius), smallRadius = cr > 0, notHemisphere = abs(cr) > ε, interpolate = d3_geo_circleInterpolate(radius, 6 * d3_radians);
    return d3_geo_clip(visible, clipLine, interpolate, smallRadius ? [ 0, -radius ] : [ -π, radius - π ]);
    function visible(λ, φ) {
      return Math.cos(λ) * Math.cos(φ) > cr;
    }
    function clipLine(listener) {
      var point0, c0, v0, v00, clean;
      return {
        lineStart: function() {
          v00 = v0 = false;
          clean = 1;
        },
        point: function(λ, φ) {
          var point1 = [ λ, φ ], point2, v = visible(λ, φ), c = smallRadius ? v ? 0 : code(λ, φ) : v ? code(λ + (λ < 0 ? π : -π), φ) : 0;
          if (!point0 && (v00 = v0 = v)) listener.lineStart();
          if (v !== v0) {
            point2 = intersect(point0, point1);
            if (d3_geo_sphericalEqual(point0, point2) || d3_geo_sphericalEqual(point1, point2)) {
              point1[0] += ε;
              point1[1] += ε;
              v = visible(point1[0], point1[1]);
            }
          }
          if (v !== v0) {
            clean = 0;
            if (v) {
              listener.lineStart();
              point2 = intersect(point1, point0);
              listener.point(point2[0], point2[1]);
            } else {
              point2 = intersect(point0, point1);
              listener.point(point2[0], point2[1]);
              listener.lineEnd();
            }
            point0 = point2;
          } else if (notHemisphere && point0 && smallRadius ^ v) {
            var t;
            if (!(c & c0) && (t = intersect(point1, point0, true))) {
              clean = 0;
              if (smallRadius) {
                listener.lineStart();
                listener.point(t[0][0], t[0][1]);
                listener.point(t[1][0], t[1][1]);
                listener.lineEnd();
              } else {
                listener.point(t[1][0], t[1][1]);
                listener.lineEnd();
                listener.lineStart();
                listener.point(t[0][0], t[0][1]);
              }
            }
          }
          if (v && (!point0 || !d3_geo_sphericalEqual(point0, point1))) {
            listener.point(point1[0], point1[1]);
          }
          point0 = point1, v0 = v, c0 = c;
        },
        lineEnd: function() {
          if (v0) listener.lineEnd();
          point0 = null;
        },
        clean: function() {
          return clean | (v00 && v0) << 1;
        }
      };
    }
    function intersect(a, b, two) {
      var pa = d3_geo_cartesian(a), pb = d3_geo_cartesian(b);
      var n1 = [ 1, 0, 0 ], n2 = d3_geo_cartesianCross(pa, pb), n2n2 = d3_geo_cartesianDot(n2, n2), n1n2 = n2[0], determinant = n2n2 - n1n2 * n1n2;
      if (!determinant) return !two && a;
      var c1 = cr * n2n2 / determinant, c2 = -cr * n1n2 / determinant, n1xn2 = d3_geo_cartesianCross(n1, n2), A = d3_geo_cartesianScale(n1, c1), B = d3_geo_cartesianScale(n2, c2);
      d3_geo_cartesianAdd(A, B);
      var u = n1xn2, w = d3_geo_cartesianDot(A, u), uu = d3_geo_cartesianDot(u, u), t2 = w * w - uu * (d3_geo_cartesianDot(A, A) - 1);
      if (t2 < 0) return;
      var t = Math.sqrt(t2), q = d3_geo_cartesianScale(u, (-w - t) / uu);
      d3_geo_cartesianAdd(q, A);
      q = d3_geo_spherical(q);
      if (!two) return q;
      var λ0 = a[0], λ1 = b[0], φ0 = a[1], φ1 = b[1], z;
      if (λ1 < λ0) z = λ0, λ0 = λ1, λ1 = z;
      var δλ = λ1 - λ0, polar = abs(δλ - π) < ε, meridian = polar || δλ < ε;
      if (!polar && φ1 < φ0) z = φ0, φ0 = φ1, φ1 = z;
      if (meridian ? polar ? φ0 + φ1 > 0 ^ q[1] < (abs(q[0] - λ0) < ε ? φ0 : φ1) : φ0 <= q[1] && q[1] <= φ1 : δλ > π ^ (λ0 <= q[0] && q[0] <= λ1)) {
        var q1 = d3_geo_cartesianScale(u, (-w + t) / uu);
        d3_geo_cartesianAdd(q1, A);
        return [ q, d3_geo_spherical(q1) ];
      }
    }
    function code(λ, φ) {
      var r = smallRadius ? radius : π - radius, code = 0;
      if (λ < -r) code |= 1; else if (λ > r) code |= 2;
      if (φ < -r) code |= 4; else if (φ > r) code |= 8;
      return code;
    }
  }
  function d3_geom_clipLine(x0, y0, x1, y1) {
    return function(line) {
      var a = line.a, b = line.b, ax = a.x, ay = a.y, bx = b.x, by = b.y, t0 = 0, t1 = 1, dx = bx - ax, dy = by - ay, r;
      r = x0 - ax;
      if (!dx && r > 0) return;
      r /= dx;
      if (dx < 0) {
        if (r < t0) return;
        if (r < t1) t1 = r;
      } else if (dx > 0) {
        if (r > t1) return;
        if (r > t0) t0 = r;
      }
      r = x1 - ax;
      if (!dx && r < 0) return;
      r /= dx;
      if (dx < 0) {
        if (r > t1) return;
        if (r > t0) t0 = r;
      } else if (dx > 0) {
        if (r < t0) return;
        if (r < t1) t1 = r;
      }
      r = y0 - ay;
      if (!dy && r > 0) return;
      r /= dy;
      if (dy < 0) {
        if (r < t0) return;
        if (r < t1) t1 = r;
      } else if (dy > 0) {
        if (r > t1) return;
        if (r > t0) t0 = r;
      }
      r = y1 - ay;
      if (!dy && r < 0) return;
      r /= dy;
      if (dy < 0) {
        if (r > t1) return;
        if (r > t0) t0 = r;
      } else if (dy > 0) {
        if (r < t0) return;
        if (r < t1) t1 = r;
      }
      if (t0 > 0) line.a = {
        x: ax + t0 * dx,
        y: ay + t0 * dy
      };
      if (t1 < 1) line.b = {
        x: ax + t1 * dx,
        y: ay + t1 * dy
      };
      return line;
    };
  }
  var d3_geo_clipExtentMAX = 1e9;
  d3.geo.clipExtent = function() {
    var x0, y0, x1, y1, stream, clip, clipExtent = {
      stream: function(output) {
        if (stream) stream.valid = false;
        stream = clip(output);
        stream.valid = true;
        return stream;
      },
      extent: function(_) {
        if (!arguments.length) return [ [ x0, y0 ], [ x1, y1 ] ];
        clip = d3_geo_clipExtent(x0 = +_[0][0], y0 = +_[0][1], x1 = +_[1][0], y1 = +_[1][1]);
        if (stream) stream.valid = false, stream = null;
        return clipExtent;
      }
    };
    return clipExtent.extent([ [ 0, 0 ], [ 960, 500 ] ]);
  };
  function d3_geo_clipExtent(x0, y0, x1, y1) {
    return function(listener) {
      var listener_ = listener, bufferListener = d3_geo_clipBufferListener(), clipLine = d3_geom_clipLine(x0, y0, x1, y1), segments, polygon, ring;
      var clip = {
        point: point,
        lineStart: lineStart,
        lineEnd: lineEnd,
        polygonStart: function() {
          listener = bufferListener;
          segments = [];
          polygon = [];
          clean = true;
        },
        polygonEnd: function() {
          listener = listener_;
          segments = d3.merge(segments);
          var clipStartInside = insidePolygon([ x0, y1 ]), inside = clean && clipStartInside, visible = segments.length;
          if (inside || visible) {
            listener.polygonStart();
            if (inside) {
              listener.lineStart();
              interpolate(null, null, 1, listener);
              listener.lineEnd();
            }
            if (visible) {
              d3_geo_clipPolygon(segments, compare, clipStartInside, interpolate, listener);
            }
            listener.polygonEnd();
          }
          segments = polygon = ring = null;
        }
      };
      function insidePolygon(p) {
        var wn = 0, n = polygon.length, y = p[1];
        for (var i = 0; i < n; ++i) {
          for (var j = 1, v = polygon[i], m = v.length, a = v[0], b; j < m; ++j) {
            b = v[j];
            if (a[1] <= y) {
              if (b[1] > y && d3_cross2d(a, b, p) > 0) ++wn;
            } else {
              if (b[1] <= y && d3_cross2d(a, b, p) < 0) --wn;
            }
            a = b;
          }
        }
        return wn !== 0;
      }
      function interpolate(from, to, direction, listener) {
        var a = 0, a1 = 0;
        if (from == null || (a = corner(from, direction)) !== (a1 = corner(to, direction)) || comparePoints(from, to) < 0 ^ direction > 0) {
          do {
            listener.point(a === 0 || a === 3 ? x0 : x1, a > 1 ? y1 : y0);
          } while ((a = (a + direction + 4) % 4) !== a1);
        } else {
          listener.point(to[0], to[1]);
        }
      }
      function pointVisible(x, y) {
        return x0 <= x && x <= x1 && y0 <= y && y <= y1;
      }
      function point(x, y) {
        if (pointVisible(x, y)) listener.point(x, y);
      }
      var x__, y__, v__, x_, y_, v_, first, clean;
      function lineStart() {
        clip.point = linePoint;
        if (polygon) polygon.push(ring = []);
        first = true;
        v_ = false;
        x_ = y_ = NaN;
      }
      function lineEnd() {
        if (segments) {
          linePoint(x__, y__);
          if (v__ && v_) bufferListener.rejoin();
          segments.push(bufferListener.buffer());
        }
        clip.point = point;
        if (v_) listener.lineEnd();
      }
      function linePoint(x, y) {
        x = Math.max(-d3_geo_clipExtentMAX, Math.min(d3_geo_clipExtentMAX, x));
        y = Math.max(-d3_geo_clipExtentMAX, Math.min(d3_geo_clipExtentMAX, y));
        var v = pointVisible(x, y);
        if (polygon) ring.push([ x, y ]);
        if (first) {
          x__ = x, y__ = y, v__ = v;
          first = false;
          if (v) {
            listener.lineStart();
            listener.point(x, y);
          }
        } else {
          if (v && v_) listener.point(x, y); else {
            var l = {
              a: {
                x: x_,
                y: y_
              },
              b: {
                x: x,
                y: y
              }
            };
            if (clipLine(l)) {
              if (!v_) {
                listener.lineStart();
                listener.point(l.a.x, l.a.y);
              }
              listener.point(l.b.x, l.b.y);
              if (!v) listener.lineEnd();
              clean = false;
            } else if (v) {
              listener.lineStart();
              listener.point(x, y);
              clean = false;
            }
          }
        }
        x_ = x, y_ = y, v_ = v;
      }
      return clip;
    };
    function corner(p, direction) {
      return abs(p[0] - x0) < ε ? direction > 0 ? 0 : 3 : abs(p[0] - x1) < ε ? direction > 0 ? 2 : 1 : abs(p[1] - y0) < ε ? direction > 0 ? 1 : 0 : direction > 0 ? 3 : 2;
    }
    function compare(a, b) {
      return comparePoints(a.x, b.x);
    }
    function comparePoints(a, b) {
      var ca = corner(a, 1), cb = corner(b, 1);
      return ca !== cb ? ca - cb : ca === 0 ? b[1] - a[1] : ca === 1 ? a[0] - b[0] : ca === 2 ? a[1] - b[1] : b[0] - a[0];
    }
  }
  function d3_geo_conic(projectAt) {
    var φ0 = 0, φ1 = π / 3, m = d3_geo_projectionMutator(projectAt), p = m(φ0, φ1);
    p.parallels = function(_) {
      if (!arguments.length) return [ φ0 / π * 180, φ1 / π * 180 ];
      return m(φ0 = _[0] * π / 180, φ1 = _[1] * π / 180);
    };
    return p;
  }
  function d3_geo_conicEqualArea(φ0, φ1) {
    var sinφ0 = Math.sin(φ0), n = (sinφ0 + Math.sin(φ1)) / 2, C = 1 + sinφ0 * (2 * n - sinφ0), ρ0 = Math.sqrt(C) / n;
    function forward(λ, φ) {
      var ρ = Math.sqrt(C - 2 * n * Math.sin(φ)) / n;
      return [ ρ * Math.sin(λ *= n), ρ0 - ρ * Math.cos(λ) ];
    }
    forward.invert = function(x, y) {
      var ρ0_y = ρ0 - y;
      return [ Math.atan2(x, ρ0_y) / n, d3_asin((C - (x * x + ρ0_y * ρ0_y) * n * n) / (2 * n)) ];
    };
    return forward;
  }
  (d3.geo.conicEqualArea = function() {
    return d3_geo_conic(d3_geo_conicEqualArea);
  }).raw = d3_geo_conicEqualArea;
  d3.geo.albers = function() {
    return d3.geo.conicEqualArea().rotate([ 96, 0 ]).center([ -.6, 38.7 ]).parallels([ 29.5, 45.5 ]).scale(1070);
  };
  d3.geo.albersUsa = function() {
    var lower48 = d3.geo.albers();
    var alaska = d3.geo.conicEqualArea().rotate([ 154, 0 ]).center([ -2, 58.5 ]).parallels([ 55, 65 ]);
    var hawaii = d3.geo.conicEqualArea().rotate([ 157, 0 ]).center([ -3, 19.9 ]).parallels([ 8, 18 ]);
    var point, pointStream = {
      point: function(x, y) {
        point = [ x, y ];
      }
    }, lower48Point, alaskaPoint, hawaiiPoint;
    function albersUsa(coordinates) {
      var x = coordinates[0], y = coordinates[1];
      point = null;
      (lower48Point(x, y), point) || (alaskaPoint(x, y), point) || hawaiiPoint(x, y);
      return point;
    }
    albersUsa.invert = function(coordinates) {
      var k = lower48.scale(), t = lower48.translate(), x = (coordinates[0] - t[0]) / k, y = (coordinates[1] - t[1]) / k;
      return (y >= .12 && y < .234 && x >= -.425 && x < -.214 ? alaska : y >= .166 && y < .234 && x >= -.214 && x < -.115 ? hawaii : lower48).invert(coordinates);
    };
    albersUsa.stream = function(stream) {
      var lower48Stream = lower48.stream(stream), alaskaStream = alaska.stream(stream), hawaiiStream = hawaii.stream(stream);
      return {
        point: function(x, y) {
          lower48Stream.point(x, y);
          alaskaStream.point(x, y);
          hawaiiStream.point(x, y);
        },
        sphere: function() {
          lower48Stream.sphere();
          alaskaStream.sphere();
          hawaiiStream.sphere();
        },
        lineStart: function() {
          lower48Stream.lineStart();
          alaskaStream.lineStart();
          hawaiiStream.lineStart();
        },
        lineEnd: function() {
          lower48Stream.lineEnd();
          alaskaStream.lineEnd();
          hawaiiStream.lineEnd();
        },
        polygonStart: function() {
          lower48Stream.polygonStart();
          alaskaStream.polygonStart();
          hawaiiStream.polygonStart();
        },
        polygonEnd: function() {
          lower48Stream.polygonEnd();
          alaskaStream.polygonEnd();
          hawaiiStream.polygonEnd();
        }
      };
    };
    albersUsa.precision = function(_) {
      if (!arguments.length) return lower48.precision();
      lower48.precision(_);
      alaska.precision(_);
      hawaii.precision(_);
      return albersUsa;
    };
    albersUsa.scale = function(_) {
      if (!arguments.length) return lower48.scale();
      lower48.scale(_);
      alaska.scale(_ * .35);
      hawaii.scale(_);
      return albersUsa.translate(lower48.translate());
    };
    albersUsa.translate = function(_) {
      if (!arguments.length) return lower48.translate();
      var k = lower48.scale(), x = +_[0], y = +_[1];
      lower48Point = lower48.translate(_).clipExtent([ [ x - .455 * k, y - .238 * k ], [ x + .455 * k, y + .238 * k ] ]).stream(pointStream).point;
      alaskaPoint = alaska.translate([ x - .307 * k, y + .201 * k ]).clipExtent([ [ x - .425 * k + ε, y + .12 * k + ε ], [ x - .214 * k - ε, y + .234 * k - ε ] ]).stream(pointStream).point;
      hawaiiPoint = hawaii.translate([ x - .205 * k, y + .212 * k ]).clipExtent([ [ x - .214 * k + ε, y + .166 * k + ε ], [ x - .115 * k - ε, y + .234 * k - ε ] ]).stream(pointStream).point;
      return albersUsa;
    };
    return albersUsa.scale(1070);
  };
  var d3_geo_pathAreaSum, d3_geo_pathAreaPolygon, d3_geo_pathArea = {
    point: d3_noop,
    lineStart: d3_noop,
    lineEnd: d3_noop,
    polygonStart: function() {
      d3_geo_pathAreaPolygon = 0;
      d3_geo_pathArea.lineStart = d3_geo_pathAreaRingStart;
    },
    polygonEnd: function() {
      d3_geo_pathArea.lineStart = d3_geo_pathArea.lineEnd = d3_geo_pathArea.point = d3_noop;
      d3_geo_pathAreaSum += abs(d3_geo_pathAreaPolygon / 2);
    }
  };
  function d3_geo_pathAreaRingStart() {
    var x00, y00, x0, y0;
    d3_geo_pathArea.point = function(x, y) {
      d3_geo_pathArea.point = nextPoint;
      x00 = x0 = x, y00 = y0 = y;
    };
    function nextPoint(x, y) {
      d3_geo_pathAreaPolygon += y0 * x - x0 * y;
      x0 = x, y0 = y;
    }
    d3_geo_pathArea.lineEnd = function() {
      nextPoint(x00, y00);
    };
  }
  var d3_geo_pathBoundsX0, d3_geo_pathBoundsY0, d3_geo_pathBoundsX1, d3_geo_pathBoundsY1;
  var d3_geo_pathBounds = {
    point: d3_geo_pathBoundsPoint,
    lineStart: d3_noop,
    lineEnd: d3_noop,
    polygonStart: d3_noop,
    polygonEnd: d3_noop
  };
  function d3_geo_pathBoundsPoint(x, y) {
    if (x < d3_geo_pathBoundsX0) d3_geo_pathBoundsX0 = x;
    if (x > d3_geo_pathBoundsX1) d3_geo_pathBoundsX1 = x;
    if (y < d3_geo_pathBoundsY0) d3_geo_pathBoundsY0 = y;
    if (y > d3_geo_pathBoundsY1) d3_geo_pathBoundsY1 = y;
  }
  function d3_geo_pathBuffer() {
    var pointCircle = d3_geo_pathBufferCircle(4.5), buffer = [];
    var stream = {
      point: point,
      lineStart: function() {
        stream.point = pointLineStart;
      },
      lineEnd: lineEnd,
      polygonStart: function() {
        stream.lineEnd = lineEndPolygon;
      },
      polygonEnd: function() {
        stream.lineEnd = lineEnd;
        stream.point = point;
      },
      pointRadius: function(_) {
        pointCircle = d3_geo_pathBufferCircle(_);
        return stream;
      },
      result: function() {
        if (buffer.length) {
          var result = buffer.join("");
          buffer = [];
          return result;
        }
      }
    };
    function point(x, y) {
      buffer.push("M", x, ",", y, pointCircle);
    }
    function pointLineStart(x, y) {
      buffer.push("M", x, ",", y);
      stream.point = pointLine;
    }
    function pointLine(x, y) {
      buffer.push("L", x, ",", y);
    }
    function lineEnd() {
      stream.point = point;
    }
    function lineEndPolygon() {
      buffer.push("Z");
    }
    return stream;
  }
  function d3_geo_pathBufferCircle(radius) {
    return "m0," + radius + "a" + radius + "," + radius + " 0 1,1 0," + -2 * radius + "a" + radius + "," + radius + " 0 1,1 0," + 2 * radius + "z";
  }
  var d3_geo_pathCentroid = {
    point: d3_geo_pathCentroidPoint,
    lineStart: d3_geo_pathCentroidLineStart,
    lineEnd: d3_geo_pathCentroidLineEnd,
    polygonStart: function() {
      d3_geo_pathCentroid.lineStart = d3_geo_pathCentroidRingStart;
    },
    polygonEnd: function() {
      d3_geo_pathCentroid.point = d3_geo_pathCentroidPoint;
      d3_geo_pathCentroid.lineStart = d3_geo_pathCentroidLineStart;
      d3_geo_pathCentroid.lineEnd = d3_geo_pathCentroidLineEnd;
    }
  };
  function d3_geo_pathCentroidPoint(x, y) {
    d3_geo_centroidX0 += x;
    d3_geo_centroidY0 += y;
    ++d3_geo_centroidZ0;
  }
  function d3_geo_pathCentroidLineStart() {
    var x0, y0;
    d3_geo_pathCentroid.point = function(x, y) {
      d3_geo_pathCentroid.point = nextPoint;
      d3_geo_pathCentroidPoint(x0 = x, y0 = y);
    };
    function nextPoint(x, y) {
      var dx = x - x0, dy = y - y0, z = Math.sqrt(dx * dx + dy * dy);
      d3_geo_centroidX1 += z * (x0 + x) / 2;
      d3_geo_centroidY1 += z * (y0 + y) / 2;
      d3_geo_centroidZ1 += z;
      d3_geo_pathCentroidPoint(x0 = x, y0 = y);
    }
  }
  function d3_geo_pathCentroidLineEnd() {
    d3_geo_pathCentroid.point = d3_geo_pathCentroidPoint;
  }
  function d3_geo_pathCentroidRingStart() {
    var x00, y00, x0, y0;
    d3_geo_pathCentroid.point = function(x, y) {
      d3_geo_pathCentroid.point = nextPoint;
      d3_geo_pathCentroidPoint(x00 = x0 = x, y00 = y0 = y);
    };
    function nextPoint(x, y) {
      var dx = x - x0, dy = y - y0, z = Math.sqrt(dx * dx + dy * dy);
      d3_geo_centroidX1 += z * (x0 + x) / 2;
      d3_geo_centroidY1 += z * (y0 + y) / 2;
      d3_geo_centroidZ1 += z;
      z = y0 * x - x0 * y;
      d3_geo_centroidX2 += z * (x0 + x);
      d3_geo_centroidY2 += z * (y0 + y);
      d3_geo_centroidZ2 += z * 3;
      d3_geo_pathCentroidPoint(x0 = x, y0 = y);
    }
    d3_geo_pathCentroid.lineEnd = function() {
      nextPoint(x00, y00);
    };
  }
  function d3_geo_pathContext(context) {
    var pointRadius = 4.5;
    var stream = {
      point: point,
      lineStart: function() {
        stream.point = pointLineStart;
      },
      lineEnd: lineEnd,
      polygonStart: function() {
        stream.lineEnd = lineEndPolygon;
      },
      polygonEnd: function() {
        stream.lineEnd = lineEnd;
        stream.point = point;
      },
      pointRadius: function(_) {
        pointRadius = _;
        return stream;
      },
      result: d3_noop
    };
    function point(x, y) {
      context.moveTo(x + pointRadius, y);
      context.arc(x, y, pointRadius, 0, τ);
    }
    function pointLineStart(x, y) {
      context.moveTo(x, y);
      stream.point = pointLine;
    }
    function pointLine(x, y) {
      context.lineTo(x, y);
    }
    function lineEnd() {
      stream.point = point;
    }
    function lineEndPolygon() {
      context.closePath();
    }
    return stream;
  }
  function d3_geo_resample(project) {
    var δ2 = .5, cosMinDistance = Math.cos(30 * d3_radians), maxDepth = 16;
    function resample(stream) {
      return (maxDepth ? resampleRecursive : resampleNone)(stream);
    }
    function resampleNone(stream) {
      return d3_geo_transformPoint(stream, function(x, y) {
        x = project(x, y);
        stream.point(x[0], x[1]);
      });
    }
    function resampleRecursive(stream) {
      var λ00, φ00, x00, y00, a00, b00, c00, λ0, x0, y0, a0, b0, c0;
      var resample = {
        point: point,
        lineStart: lineStart,
        lineEnd: lineEnd,
        polygonStart: function() {
          stream.polygonStart();
          resample.lineStart = ringStart;
        },
        polygonEnd: function() {
          stream.polygonEnd();
          resample.lineStart = lineStart;
        }
      };
      function point(x, y) {
        x = project(x, y);
        stream.point(x[0], x[1]);
      }
      function lineStart() {
        x0 = NaN;
        resample.point = linePoint;
        stream.lineStart();
      }
      function linePoint(λ, φ) {
        var c = d3_geo_cartesian([ λ, φ ]), p = project(λ, φ);
        resampleLineTo(x0, y0, λ0, a0, b0, c0, x0 = p[0], y0 = p[1], λ0 = λ, a0 = c[0], b0 = c[1], c0 = c[2], maxDepth, stream);
        stream.point(x0, y0);
      }
      function lineEnd() {
        resample.point = point;
        stream.lineEnd();
      }
      function ringStart() {
        lineStart();
        resample.point = ringPoint;
        resample.lineEnd = ringEnd;
      }
      function ringPoint(λ, φ) {
        linePoint(λ00 = λ, φ00 = φ), x00 = x0, y00 = y0, a00 = a0, b00 = b0, c00 = c0;
        resample.point = linePoint;
      }
      function ringEnd() {
        resampleLineTo(x0, y0, λ0, a0, b0, c0, x00, y00, λ00, a00, b00, c00, maxDepth, stream);
        resample.lineEnd = lineEnd;
        lineEnd();
      }
      return resample;
    }
    function resampleLineTo(x0, y0, λ0, a0, b0, c0, x1, y1, λ1, a1, b1, c1, depth, stream) {
      var dx = x1 - x0, dy = y1 - y0, d2 = dx * dx + dy * dy;
      if (d2 > 4 * δ2 && depth--) {
        var a = a0 + a1, b = b0 + b1, c = c0 + c1, m = Math.sqrt(a * a + b * b + c * c), φ2 = Math.asin(c /= m), λ2 = abs(abs(c) - 1) < ε || abs(λ0 - λ1) < ε ? (λ0 + λ1) / 2 : Math.atan2(b, a), p = project(λ2, φ2), x2 = p[0], y2 = p[1], dx2 = x2 - x0, dy2 = y2 - y0, dz = dy * dx2 - dx * dy2;
        if (dz * dz / d2 > δ2 || abs((dx * dx2 + dy * dy2) / d2 - .5) > .3 || a0 * a1 + b0 * b1 + c0 * c1 < cosMinDistance) {
          resampleLineTo(x0, y0, λ0, a0, b0, c0, x2, y2, λ2, a /= m, b /= m, c, depth, stream);
          stream.point(x2, y2);
          resampleLineTo(x2, y2, λ2, a, b, c, x1, y1, λ1, a1, b1, c1, depth, stream);
        }
      }
    }
    resample.precision = function(_) {
      if (!arguments.length) return Math.sqrt(δ2);
      maxDepth = (δ2 = _ * _) > 0 && 16;
      return resample;
    };
    return resample;
  }
  d3.geo.path = function() {
    var pointRadius = 4.5, projection, context, projectStream, contextStream, cacheStream;
    function path(object) {
      if (object) {
        if (typeof pointRadius === "function") contextStream.pointRadius(+pointRadius.apply(this, arguments));
        if (!cacheStream || !cacheStream.valid) cacheStream = projectStream(contextStream);
        d3.geo.stream(object, cacheStream);
      }
      return contextStream.result();
    }
    path.area = function(object) {
      d3_geo_pathAreaSum = 0;
      d3.geo.stream(object, projectStream(d3_geo_pathArea));
      return d3_geo_pathAreaSum;
    };
    path.centroid = function(object) {
      d3_geo_centroidX0 = d3_geo_centroidY0 = d3_geo_centroidZ0 = d3_geo_centroidX1 = d3_geo_centroidY1 = d3_geo_centroidZ1 = d3_geo_centroidX2 = d3_geo_centroidY2 = d3_geo_centroidZ2 = 0;
      d3.geo.stream(object, projectStream(d3_geo_pathCentroid));
      return d3_geo_centroidZ2 ? [ d3_geo_centroidX2 / d3_geo_centroidZ2, d3_geo_centroidY2 / d3_geo_centroidZ2 ] : d3_geo_centroidZ1 ? [ d3_geo_centroidX1 / d3_geo_centroidZ1, d3_geo_centroidY1 / d3_geo_centroidZ1 ] : d3_geo_centroidZ0 ? [ d3_geo_centroidX0 / d3_geo_centroidZ0, d3_geo_centroidY0 / d3_geo_centroidZ0 ] : [ NaN, NaN ];
    };
    path.bounds = function(object) {
      d3_geo_pathBoundsX1 = d3_geo_pathBoundsY1 = -(d3_geo_pathBoundsX0 = d3_geo_pathBoundsY0 = Infinity);
      d3.geo.stream(object, projectStream(d3_geo_pathBounds));
      return [ [ d3_geo_pathBoundsX0, d3_geo_pathBoundsY0 ], [ d3_geo_pathBoundsX1, d3_geo_pathBoundsY1 ] ];
    };
    path.projection = function(_) {
      if (!arguments.length) return projection;
      projectStream = (projection = _) ? _.stream || d3_geo_pathProjectStream(_) : d3_identity;
      return reset();
    };
    path.context = function(_) {
      if (!arguments.length) return context;
      contextStream = (context = _) == null ? new d3_geo_pathBuffer() : new d3_geo_pathContext(_);
      if (typeof pointRadius !== "function") contextStream.pointRadius(pointRadius);
      return reset();
    };
    path.pointRadius = function(_) {
      if (!arguments.length) return pointRadius;
      pointRadius = typeof _ === "function" ? _ : (contextStream.pointRadius(+_), +_);
      return path;
    };
    function reset() {
      cacheStream = null;
      return path;
    }
    return path.projection(d3.geo.albersUsa()).context(null);
  };
  function d3_geo_pathProjectStream(project) {
    var resample = d3_geo_resample(function(x, y) {
      return project([ x * d3_degrees, y * d3_degrees ]);
    });
    return function(stream) {
      return d3_geo_projectionRadians(resample(stream));
    };
  }
  d3.geo.transform = function(methods) {
    return {
      stream: function(stream) {
        var transform = new d3_geo_transform(stream);
        for (var k in methods) transform[k] = methods[k];
        return transform;
      }
    };
  };
  function d3_geo_transform(stream) {
    this.stream = stream;
  }
  d3_geo_transform.prototype = {
    point: function(x, y) {
      this.stream.point(x, y);
    },
    sphere: function() {
      this.stream.sphere();
    },
    lineStart: function() {
      this.stream.lineStart();
    },
    lineEnd: function() {
      this.stream.lineEnd();
    },
    polygonStart: function() {
      this.stream.polygonStart();
    },
    polygonEnd: function() {
      this.stream.polygonEnd();
    }
  };
  function d3_geo_transformPoint(stream, point) {
    return {
      point: point,
      sphere: function() {
        stream.sphere();
      },
      lineStart: function() {
        stream.lineStart();
      },
      lineEnd: function() {
        stream.lineEnd();
      },
      polygonStart: function() {
        stream.polygonStart();
      },
      polygonEnd: function() {
        stream.polygonEnd();
      }
    };
  }
  d3.geo.projection = d3_geo_projection;
  d3.geo.projectionMutator = d3_geo_projectionMutator;
  function d3_geo_projection(project) {
    return d3_geo_projectionMutator(function() {
      return project;
    })();
  }
  function d3_geo_projectionMutator(projectAt) {
    var project, rotate, projectRotate, projectResample = d3_geo_resample(function(x, y) {
      x = project(x, y);
      return [ x[0] * k + δx, δy - x[1] * k ];
    }), k = 150, x = 480, y = 250, λ = 0, φ = 0, δλ = 0, δφ = 0, δγ = 0, δx, δy, preclip = d3_geo_clipAntimeridian, postclip = d3_identity, clipAngle = null, clipExtent = null, stream;
    function projection(point) {
      point = projectRotate(point[0] * d3_radians, point[1] * d3_radians);
      return [ point[0] * k + δx, δy - point[1] * k ];
    }
    function invert(point) {
      point = projectRotate.invert((point[0] - δx) / k, (δy - point[1]) / k);
      return point && [ point[0] * d3_degrees, point[1] * d3_degrees ];
    }
    projection.stream = function(output) {
      if (stream) stream.valid = false;
      stream = d3_geo_projectionRadians(preclip(rotate, projectResample(postclip(output))));
      stream.valid = true;
      return stream;
    };
    projection.clipAngle = function(_) {
      if (!arguments.length) return clipAngle;
      preclip = _ == null ? (clipAngle = _, d3_geo_clipAntimeridian) : d3_geo_clipCircle((clipAngle = +_) * d3_radians);
      return invalidate();
    };
    projection.clipExtent = function(_) {
      if (!arguments.length) return clipExtent;
      clipExtent = _;
      postclip = _ ? d3_geo_clipExtent(_[0][0], _[0][1], _[1][0], _[1][1]) : d3_identity;
      return invalidate();
    };
    projection.scale = function(_) {
      if (!arguments.length) return k;
      k = +_;
      return reset();
    };
    projection.translate = function(_) {
      if (!arguments.length) return [ x, y ];
      x = +_[0];
      y = +_[1];
      return reset();
    };
    projection.center = function(_) {
      if (!arguments.length) return [ λ * d3_degrees, φ * d3_degrees ];
      λ = _[0] % 360 * d3_radians;
      φ = _[1] % 360 * d3_radians;
      return reset();
    };
    projection.rotate = function(_) {
      if (!arguments.length) return [ δλ * d3_degrees, δφ * d3_degrees, δγ * d3_degrees ];
      δλ = _[0] % 360 * d3_radians;
      δφ = _[1] % 360 * d3_radians;
      δγ = _.length > 2 ? _[2] % 360 * d3_radians : 0;
      return reset();
    };
    d3.rebind(projection, projectResample, "precision");
    function reset() {
      projectRotate = d3_geo_compose(rotate = d3_geo_rotation(δλ, δφ, δγ), project);
      var center = project(λ, φ);
      δx = x - center[0] * k;
      δy = y + center[1] * k;
      return invalidate();
    }
    function invalidate() {
      if (stream) stream.valid = false, stream = null;
      return projection;
    }
    return function() {
      project = projectAt.apply(this, arguments);
      projection.invert = project.invert && invert;
      return reset();
    };
  }
  function d3_geo_projectionRadians(stream) {
    return d3_geo_transformPoint(stream, function(x, y) {
      stream.point(x * d3_radians, y * d3_radians);
    });
  }
  function d3_geo_equirectangular(λ, φ) {
    return [ λ, φ ];
  }
  (d3.geo.equirectangular = function() {
    return d3_geo_projection(d3_geo_equirectangular);
  }).raw = d3_geo_equirectangular.invert = d3_geo_equirectangular;
  d3.geo.rotation = function(rotate) {
    rotate = d3_geo_rotation(rotate[0] % 360 * d3_radians, rotate[1] * d3_radians, rotate.length > 2 ? rotate[2] * d3_radians : 0);
    function forward(coordinates) {
      coordinates = rotate(coordinates[0] * d3_radians, coordinates[1] * d3_radians);
      return coordinates[0] *= d3_degrees, coordinates[1] *= d3_degrees, coordinates;
    }
    forward.invert = function(coordinates) {
      coordinates = rotate.invert(coordinates[0] * d3_radians, coordinates[1] * d3_radians);
      return coordinates[0] *= d3_degrees, coordinates[1] *= d3_degrees, coordinates;
    };
    return forward;
  };
  function d3_geo_identityRotation(λ, φ) {
    return [ λ > π ? λ - τ : λ < -π ? λ + τ : λ, φ ];
  }
  d3_geo_identityRotation.invert = d3_geo_equirectangular;
  function d3_geo_rotation(δλ, δφ, δγ) {
    return δλ ? δφ || δγ ? d3_geo_compose(d3_geo_rotationλ(δλ), d3_geo_rotationφγ(δφ, δγ)) : d3_geo_rotationλ(δλ) : δφ || δγ ? d3_geo_rotationφγ(δφ, δγ) : d3_geo_identityRotation;
  }
  function d3_geo_forwardRotationλ(δλ) {
    return function(λ, φ) {
      return λ += δλ, [ λ > π ? λ - τ : λ < -π ? λ + τ : λ, φ ];
    };
  }
  function d3_geo_rotationλ(δλ) {
    var rotation = d3_geo_forwardRotationλ(δλ);
    rotation.invert = d3_geo_forwardRotationλ(-δλ);
    return rotation;
  }
  function d3_geo_rotationφγ(δφ, δγ) {
    var cosδφ = Math.cos(δφ), sinδφ = Math.sin(δφ), cosδγ = Math.cos(δγ), sinδγ = Math.sin(δγ);
    function rotation(λ, φ) {
      var cosφ = Math.cos(φ), x = Math.cos(λ) * cosφ, y = Math.sin(λ) * cosφ, z = Math.sin(φ), k = z * cosδφ + x * sinδφ;
      return [ Math.atan2(y * cosδγ - k * sinδγ, x * cosδφ - z * sinδφ), d3_asin(k * cosδγ + y * sinδγ) ];
    }
    rotation.invert = function(λ, φ) {
      var cosφ = Math.cos(φ), x = Math.cos(λ) * cosφ, y = Math.sin(λ) * cosφ, z = Math.sin(φ), k = z * cosδγ - y * sinδγ;
      return [ Math.atan2(y * cosδγ + z * sinδγ, x * cosδφ + k * sinδφ), d3_asin(k * cosδφ - x * sinδφ) ];
    };
    return rotation;
  }
  d3.geo.circle = function() {
    var origin = [ 0, 0 ], angle, precision = 6, interpolate;
    function circle() {
      var center = typeof origin === "function" ? origin.apply(this, arguments) : origin, rotate = d3_geo_rotation(-center[0] * d3_radians, -center[1] * d3_radians, 0).invert, ring = [];
      interpolate(null, null, 1, {
        point: function(x, y) {
          ring.push(x = rotate(x, y));
          x[0] *= d3_degrees, x[1] *= d3_degrees;
        }
      });
      return {
        type: "Polygon",
        coordinates: [ ring ]
      };
    }
    circle.origin = function(x) {
      if (!arguments.length) return origin;
      origin = x;
      return circle;
    };
    circle.angle = function(x) {
      if (!arguments.length) return angle;
      interpolate = d3_geo_circleInterpolate((angle = +x) * d3_radians, precision * d3_radians);
      return circle;
    };
    circle.precision = function(_) {
      if (!arguments.length) return precision;
      interpolate = d3_geo_circleInterpolate(angle * d3_radians, (precision = +_) * d3_radians);
      return circle;
    };
    return circle.angle(90);
  };
  function d3_geo_circleInterpolate(radius, precision) {
    var cr = Math.cos(radius), sr = Math.sin(radius);
    return function(from, to, direction, listener) {
      var step = direction * precision;
      if (from != null) {
        from = d3_geo_circleAngle(cr, from);
        to = d3_geo_circleAngle(cr, to);
        if (direction > 0 ? from < to : from > to) from += direction * τ;
      } else {
        from = radius + direction * τ;
        to = radius - .5 * step;
      }
      for (var point, t = from; direction > 0 ? t > to : t < to; t -= step) {
        listener.point((point = d3_geo_spherical([ cr, -sr * Math.cos(t), -sr * Math.sin(t) ]))[0], point[1]);
      }
    };
  }
  function d3_geo_circleAngle(cr, point) {
    var a = d3_geo_cartesian(point);
    a[0] -= cr;
    d3_geo_cartesianNormalize(a);
    var angle = d3_acos(-a[1]);
    return ((-a[2] < 0 ? -angle : angle) + 2 * Math.PI - ε) % (2 * Math.PI);
  }
  d3.geo.distance = function(a, b) {
    var Δλ = (b[0] - a[0]) * d3_radians, φ0 = a[1] * d3_radians, φ1 = b[1] * d3_radians, sinΔλ = Math.sin(Δλ), cosΔλ = Math.cos(Δλ), sinφ0 = Math.sin(φ0), cosφ0 = Math.cos(φ0), sinφ1 = Math.sin(φ1), cosφ1 = Math.cos(φ1), t;
    return Math.atan2(Math.sqrt((t = cosφ1 * sinΔλ) * t + (t = cosφ0 * sinφ1 - sinφ0 * cosφ1 * cosΔλ) * t), sinφ0 * sinφ1 + cosφ0 * cosφ1 * cosΔλ);
  };
  d3.geo.graticule = function() {
    var x1, x0, X1, X0, y1, y0, Y1, Y0, dx = 10, dy = dx, DX = 90, DY = 360, x, y, X, Y, precision = 2.5;
    function graticule() {
      return {
        type: "MultiLineString",
        coordinates: lines()
      };
    }
    function lines() {
      return d3.range(Math.ceil(X0 / DX) * DX, X1, DX).map(X).concat(d3.range(Math.ceil(Y0 / DY) * DY, Y1, DY).map(Y)).concat(d3.range(Math.ceil(x0 / dx) * dx, x1, dx).filter(function(x) {
        return abs(x % DX) > ε;
      }).map(x)).concat(d3.range(Math.ceil(y0 / dy) * dy, y1, dy).filter(function(y) {
        return abs(y % DY) > ε;
      }).map(y));
    }
    graticule.lines = function() {
      return lines().map(function(coordinates) {
        return {
          type: "LineString",
          coordinates: coordinates
        };
      });
    };
    graticule.outline = function() {
      return {
        type: "Polygon",
        coordinates: [ X(X0).concat(Y(Y1).slice(1), X(X1).reverse().slice(1), Y(Y0).reverse().slice(1)) ]
      };
    };
    graticule.extent = function(_) {
      if (!arguments.length) return graticule.minorExtent();
      return graticule.majorExtent(_).minorExtent(_);
    };
    graticule.majorExtent = function(_) {
      if (!arguments.length) return [ [ X0, Y0 ], [ X1, Y1 ] ];
      X0 = +_[0][0], X1 = +_[1][0];
      Y0 = +_[0][1], Y1 = +_[1][1];
      if (X0 > X1) _ = X0, X0 = X1, X1 = _;
      if (Y0 > Y1) _ = Y0, Y0 = Y1, Y1 = _;
      return graticule.precision(precision);
    };
    graticule.minorExtent = function(_) {
      if (!arguments.length) return [ [ x0, y0 ], [ x1, y1 ] ];
      x0 = +_[0][0], x1 = +_[1][0];
      y0 = +_[0][1], y1 = +_[1][1];
      if (x0 > x1) _ = x0, x0 = x1, x1 = _;
      if (y0 > y1) _ = y0, y0 = y1, y1 = _;
      return graticule.precision(precision);
    };
    graticule.step = function(_) {
      if (!arguments.length) return graticule.minorStep();
      return graticule.majorStep(_).minorStep(_);
    };
    graticule.majorStep = function(_) {
      if (!arguments.length) return [ DX, DY ];
      DX = +_[0], DY = +_[1];
      return graticule;
    };
    graticule.minorStep = function(_) {
      if (!arguments.length) return [ dx, dy ];
      dx = +_[0], dy = +_[1];
      return graticule;
    };
    graticule.precision = function(_) {
      if (!arguments.length) return precision;
      precision = +_;
      x = d3_geo_graticuleX(y0, y1, 90);
      y = d3_geo_graticuleY(x0, x1, precision);
      X = d3_geo_graticuleX(Y0, Y1, 90);
      Y = d3_geo_graticuleY(X0, X1, precision);
      return graticule;
    };
    return graticule.majorExtent([ [ -180, -90 + ε ], [ 180, 90 - ε ] ]).minorExtent([ [ -180, -80 - ε ], [ 180, 80 + ε ] ]);
  };
  function d3_geo_graticuleX(y0, y1, dy) {
    var y = d3.range(y0, y1 - ε, dy).concat(y1);
    return function(x) {
      return y.map(function(y) {
        return [ x, y ];
      });
    };
  }
  function d3_geo_graticuleY(x0, x1, dx) {
    var x = d3.range(x0, x1 - ε, dx).concat(x1);
    return function(y) {
      return x.map(function(x) {
        return [ x, y ];
      });
    };
  }
  function d3_source(d) {
    return d.source;
  }
  function d3_target(d) {
    return d.target;
  }
  d3.geo.greatArc = function() {
    var source = d3_source, source_, target = d3_target, target_;
    function greatArc() {
      return {
        type: "LineString",
        coordinates: [ source_ || source.apply(this, arguments), target_ || target.apply(this, arguments) ]
      };
    }
    greatArc.distance = function() {
      return d3.geo.distance(source_ || source.apply(this, arguments), target_ || target.apply(this, arguments));
    };
    greatArc.source = function(_) {
      if (!arguments.length) return source;
      source = _, source_ = typeof _ === "function" ? null : _;
      return greatArc;
    };
    greatArc.target = function(_) {
      if (!arguments.length) return target;
      target = _, target_ = typeof _ === "function" ? null : _;
      return greatArc;
    };
    greatArc.precision = function() {
      return arguments.length ? greatArc : 0;
    };
    return greatArc;
  };
  d3.geo.interpolate = function(source, target) {
    return d3_geo_interpolate(source[0] * d3_radians, source[1] * d3_radians, target[0] * d3_radians, target[1] * d3_radians);
  };
  function d3_geo_interpolate(x0, y0, x1, y1) {
    var cy0 = Math.cos(y0), sy0 = Math.sin(y0), cy1 = Math.cos(y1), sy1 = Math.sin(y1), kx0 = cy0 * Math.cos(x0), ky0 = cy0 * Math.sin(x0), kx1 = cy1 * Math.cos(x1), ky1 = cy1 * Math.sin(x1), d = 2 * Math.asin(Math.sqrt(d3_haversin(y1 - y0) + cy0 * cy1 * d3_haversin(x1 - x0))), k = 1 / Math.sin(d);
    var interpolate = d ? function(t) {
      var B = Math.sin(t *= d) * k, A = Math.sin(d - t) * k, x = A * kx0 + B * kx1, y = A * ky0 + B * ky1, z = A * sy0 + B * sy1;
      return [ Math.atan2(y, x) * d3_degrees, Math.atan2(z, Math.sqrt(x * x + y * y)) * d3_degrees ];
    } : function() {
      return [ x0 * d3_degrees, y0 * d3_degrees ];
    };
    interpolate.distance = d;
    return interpolate;
  }
  d3.geo.length = function(object) {
    d3_geo_lengthSum = 0;
    d3.geo.stream(object, d3_geo_length);
    return d3_geo_lengthSum;
  };
  var d3_geo_lengthSum;
  var d3_geo_length = {
    sphere: d3_noop,
    point: d3_noop,
    lineStart: d3_geo_lengthLineStart,
    lineEnd: d3_noop,
    polygonStart: d3_noop,
    polygonEnd: d3_noop
  };
  function d3_geo_lengthLineStart() {
    var λ0, sinφ0, cosφ0;
    d3_geo_length.point = function(λ, φ) {
      λ0 = λ * d3_radians, sinφ0 = Math.sin(φ *= d3_radians), cosφ0 = Math.cos(φ);
      d3_geo_length.point = nextPoint;
    };
    d3_geo_length.lineEnd = function() {
      d3_geo_length.point = d3_geo_length.lineEnd = d3_noop;
    };
    function nextPoint(λ, φ) {
      var sinφ = Math.sin(φ *= d3_radians), cosφ = Math.cos(φ), t = abs((λ *= d3_radians) - λ0), cosΔλ = Math.cos(t);
      d3_geo_lengthSum += Math.atan2(Math.sqrt((t = cosφ * Math.sin(t)) * t + (t = cosφ0 * sinφ - sinφ0 * cosφ * cosΔλ) * t), sinφ0 * sinφ + cosφ0 * cosφ * cosΔλ);
      λ0 = λ, sinφ0 = sinφ, cosφ0 = cosφ;
    }
  }
  function d3_geo_azimuthal(scale, angle) {
    function azimuthal(λ, φ) {
      var cosλ = Math.cos(λ), cosφ = Math.cos(φ), k = scale(cosλ * cosφ);
      return [ k * cosφ * Math.sin(λ), k * Math.sin(φ) ];
    }
    azimuthal.invert = function(x, y) {
      var ρ = Math.sqrt(x * x + y * y), c = angle(ρ), sinc = Math.sin(c), cosc = Math.cos(c);
      return [ Math.atan2(x * sinc, ρ * cosc), Math.asin(ρ && y * sinc / ρ) ];
    };
    return azimuthal;
  }
  var d3_geo_azimuthalEqualArea = d3_geo_azimuthal(function(cosλcosφ) {
    return Math.sqrt(2 / (1 + cosλcosφ));
  }, function(ρ) {
    return 2 * Math.asin(ρ / 2);
  });
  (d3.geo.azimuthalEqualArea = function() {
    return d3_geo_projection(d3_geo_azimuthalEqualArea);
  }).raw = d3_geo_azimuthalEqualArea;
  var d3_geo_azimuthalEquidistant = d3_geo_azimuthal(function(cosλcosφ) {
    var c = Math.acos(cosλcosφ);
    return c && c / Math.sin(c);
  }, d3_identity);
  (d3.geo.azimuthalEquidistant = function() {
    return d3_geo_projection(d3_geo_azimuthalEquidistant);
  }).raw = d3_geo_azimuthalEquidistant;
  function d3_geo_conicConformal(φ0, φ1) {
    var cosφ0 = Math.cos(φ0), t = function(φ) {
      return Math.tan(π / 4 + φ / 2);
    }, n = φ0 === φ1 ? Math.sin(φ0) : Math.log(cosφ0 / Math.cos(φ1)) / Math.log(t(φ1) / t(φ0)), F = cosφ0 * Math.pow(t(φ0), n) / n;
    if (!n) return d3_geo_mercator;
    function forward(λ, φ) {
      if (F > 0) {
        if (φ < -halfπ + ε) φ = -halfπ + ε;
      } else {
        if (φ > halfπ - ε) φ = halfπ - ε;
      }
      var ρ = F / Math.pow(t(φ), n);
      return [ ρ * Math.sin(n * λ), F - ρ * Math.cos(n * λ) ];
    }
    forward.invert = function(x, y) {
      var ρ0_y = F - y, ρ = d3_sgn(n) * Math.sqrt(x * x + ρ0_y * ρ0_y);
      return [ Math.atan2(x, ρ0_y) / n, 2 * Math.atan(Math.pow(F / ρ, 1 / n)) - halfπ ];
    };
    return forward;
  }
  (d3.geo.conicConformal = function() {
    return d3_geo_conic(d3_geo_conicConformal);
  }).raw = d3_geo_conicConformal;
  function d3_geo_conicEquidistant(φ0, φ1) {
    var cosφ0 = Math.cos(φ0), n = φ0 === φ1 ? Math.sin(φ0) : (cosφ0 - Math.cos(φ1)) / (φ1 - φ0), G = cosφ0 / n + φ0;
    if (abs(n) < ε) return d3_geo_equirectangular;
    function forward(λ, φ) {
      var ρ = G - φ;
      return [ ρ * Math.sin(n * λ), G - ρ * Math.cos(n * λ) ];
    }
    forward.invert = function(x, y) {
      var ρ0_y = G - y;
      return [ Math.atan2(x, ρ0_y) / n, G - d3_sgn(n) * Math.sqrt(x * x + ρ0_y * ρ0_y) ];
    };
    return forward;
  }
  (d3.geo.conicEquidistant = function() {
    return d3_geo_conic(d3_geo_conicEquidistant);
  }).raw = d3_geo_conicEquidistant;
  var d3_geo_gnomonic = d3_geo_azimuthal(function(cosλcosφ) {
    return 1 / cosλcosφ;
  }, Math.atan);
  (d3.geo.gnomonic = function() {
    return d3_geo_projection(d3_geo_gnomonic);
  }).raw = d3_geo_gnomonic;
  function d3_geo_mercator(λ, φ) {
    return [ λ, Math.log(Math.tan(π / 4 + φ / 2)) ];
  }
  d3_geo_mercator.invert = function(x, y) {
    return [ x, 2 * Math.atan(Math.exp(y)) - halfπ ];
  };
  function d3_geo_mercatorProjection(project) {
    var m = d3_geo_projection(project), scale = m.scale, translate = m.translate, clipExtent = m.clipExtent, clipAuto;
    m.scale = function() {
      var v = scale.apply(m, arguments);
      return v === m ? clipAuto ? m.clipExtent(null) : m : v;
    };
    m.translate = function() {
      var v = translate.apply(m, arguments);
      return v === m ? clipAuto ? m.clipExtent(null) : m : v;
    };
    m.clipExtent = function(_) {
      var v = clipExtent.apply(m, arguments);
      if (v === m) {
        if (clipAuto = _ == null) {
          var k = π * scale(), t = translate();
          clipExtent([ [ t[0] - k, t[1] - k ], [ t[0] + k, t[1] + k ] ]);
        }
      } else if (clipAuto) {
        v = null;
      }
      return v;
    };
    return m.clipExtent(null);
  }
  (d3.geo.mercator = function() {
    return d3_geo_mercatorProjection(d3_geo_mercator);
  }).raw = d3_geo_mercator;
  var d3_geo_orthographic = d3_geo_azimuthal(function() {
    return 1;
  }, Math.asin);
  (d3.geo.orthographic = function() {
    return d3_geo_projection(d3_geo_orthographic);
  }).raw = d3_geo_orthographic;
  var d3_geo_stereographic = d3_geo_azimuthal(function(cosλcosφ) {
    return 1 / (1 + cosλcosφ);
  }, function(ρ) {
    return 2 * Math.atan(ρ);
  });
  (d3.geo.stereographic = function() {
    return d3_geo_projection(d3_geo_stereographic);
  }).raw = d3_geo_stereographic;
  function d3_geo_transverseMercator(λ, φ) {
    return [ Math.log(Math.tan(π / 4 + φ / 2)), -λ ];
  }
  d3_geo_transverseMercator.invert = function(x, y) {
    return [ -y, 2 * Math.atan(Math.exp(x)) - halfπ ];
  };
  (d3.geo.transverseMercator = function() {
    var projection = d3_geo_mercatorProjection(d3_geo_transverseMercator), center = projection.center, rotate = projection.rotate;
    projection.center = function(_) {
      return _ ? center([ -_[1], _[0] ]) : (_ = center(), [ _[1], -_[0] ]);
    };
    projection.rotate = function(_) {
      return _ ? rotate([ _[0], _[1], _.length > 2 ? _[2] + 90 : 90 ]) : (_ = rotate(), 
      [ _[0], _[1], _[2] - 90 ]);
    };
    return rotate([ 0, 0, 90 ]);
  }).raw = d3_geo_transverseMercator;
  d3.geom = {};
  function d3_geom_pointX(d) {
    return d[0];
  }
  function d3_geom_pointY(d) {
    return d[1];
  }
  d3.geom.hull = function(vertices) {
    var x = d3_geom_pointX, y = d3_geom_pointY;
    if (arguments.length) return hull(vertices);
    function hull(data) {
      if (data.length < 3) return [];
      var fx = d3_functor(x), fy = d3_functor(y), i, n = data.length, points = [], flippedPoints = [];
      for (i = 0; i < n; i++) {
        points.push([ +fx.call(this, data[i], i), +fy.call(this, data[i], i), i ]);
      }
      points.sort(d3_geom_hullOrder);
      for (i = 0; i < n; i++) flippedPoints.push([ points[i][0], -points[i][1] ]);
      var upper = d3_geom_hullUpper(points), lower = d3_geom_hullUpper(flippedPoints);
      var skipLeft = lower[0] === upper[0], skipRight = lower[lower.length - 1] === upper[upper.length - 1], polygon = [];
      for (i = upper.length - 1; i >= 0; --i) polygon.push(data[points[upper[i]][2]]);
      for (i = +skipLeft; i < lower.length - skipRight; ++i) polygon.push(data[points[lower[i]][2]]);
      return polygon;
    }
    hull.x = function(_) {
      return arguments.length ? (x = _, hull) : x;
    };
    hull.y = function(_) {
      return arguments.length ? (y = _, hull) : y;
    };
    return hull;
  };
  function d3_geom_hullUpper(points) {
    var n = points.length, hull = [ 0, 1 ], hs = 2;
    for (var i = 2; i < n; i++) {
      while (hs > 1 && d3_cross2d(points[hull[hs - 2]], points[hull[hs - 1]], points[i]) <= 0) --hs;
      hull[hs++] = i;
    }
    return hull.slice(0, hs);
  }
  function d3_geom_hullOrder(a, b) {
    return a[0] - b[0] || a[1] - b[1];
  }
  d3.geom.polygon = function(coordinates) {
    d3_subclass(coordinates, d3_geom_polygonPrototype);
    return coordinates;
  };
  var d3_geom_polygonPrototype = d3.geom.polygon.prototype = [];
  d3_geom_polygonPrototype.area = function() {
    var i = -1, n = this.length, a, b = this[n - 1], area = 0;
    while (++i < n) {
      a = b;
      b = this[i];
      area += a[1] * b[0] - a[0] * b[1];
    }
    return area * .5;
  };
  d3_geom_polygonPrototype.centroid = function(k) {
    var i = -1, n = this.length, x = 0, y = 0, a, b = this[n - 1], c;
    if (!arguments.length) k = -1 / (6 * this.area());
    while (++i < n) {
      a = b;
      b = this[i];
      c = a[0] * b[1] - b[0] * a[1];
      x += (a[0] + b[0]) * c;
      y += (a[1] + b[1]) * c;
    }
    return [ x * k, y * k ];
  };
  d3_geom_polygonPrototype.clip = function(subject) {
    var input, closed = d3_geom_polygonClosed(subject), i = -1, n = this.length - d3_geom_polygonClosed(this), j, m, a = this[n - 1], b, c, d;
    while (++i < n) {
      input = subject.slice();
      subject.length = 0;
      b = this[i];
      c = input[(m = input.length - closed) - 1];
      j = -1;
      while (++j < m) {
        d = input[j];
        if (d3_geom_polygonInside(d, a, b)) {
          if (!d3_geom_polygonInside(c, a, b)) {
            subject.push(d3_geom_polygonIntersect(c, d, a, b));
          }
          subject.push(d);
        } else if (d3_geom_polygonInside(c, a, b)) {
          subject.push(d3_geom_polygonIntersect(c, d, a, b));
        }
        c = d;
      }
      if (closed) subject.push(subject[0]);
      a = b;
    }
    return subject;
  };
  function d3_geom_polygonInside(p, a, b) {
    return (b[0] - a[0]) * (p[1] - a[1]) < (b[1] - a[1]) * (p[0] - a[0]);
  }
  function d3_geom_polygonIntersect(c, d, a, b) {
    var x1 = c[0], x3 = a[0], x21 = d[0] - x1, x43 = b[0] - x3, y1 = c[1], y3 = a[1], y21 = d[1] - y1, y43 = b[1] - y3, ua = (x43 * (y1 - y3) - y43 * (x1 - x3)) / (y43 * x21 - x43 * y21);
    return [ x1 + ua * x21, y1 + ua * y21 ];
  }
  function d3_geom_polygonClosed(coordinates) {
    var a = coordinates[0], b = coordinates[coordinates.length - 1];
    return !(a[0] - b[0] || a[1] - b[1]);
  }
  var d3_geom_voronoiEdges, d3_geom_voronoiCells, d3_geom_voronoiBeaches, d3_geom_voronoiBeachPool = [], d3_geom_voronoiFirstCircle, d3_geom_voronoiCircles, d3_geom_voronoiCirclePool = [];
  function d3_geom_voronoiBeach() {
    d3_geom_voronoiRedBlackNode(this);
    this.edge = this.site = this.circle = null;
  }
  function d3_geom_voronoiCreateBeach(site) {
    var beach = d3_geom_voronoiBeachPool.pop() || new d3_geom_voronoiBeach();
    beach.site = site;
    return beach;
  }
  function d3_geom_voronoiDetachBeach(beach) {
    d3_geom_voronoiDetachCircle(beach);
    d3_geom_voronoiBeaches.remove(beach);
    d3_geom_voronoiBeachPool.push(beach);
    d3_geom_voronoiRedBlackNode(beach);
  }
  function d3_geom_voronoiRemoveBeach(beach) {
    var circle = beach.circle, x = circle.x, y = circle.cy, vertex = {
      x: x,
      y: y
    }, previous = beach.P, next = beach.N, disappearing = [ beach ];
    d3_geom_voronoiDetachBeach(beach);
    var lArc = previous;
    while (lArc.circle && abs(x - lArc.circle.x) < ε && abs(y - lArc.circle.cy) < ε) {
      previous = lArc.P;
      disappearing.unshift(lArc);
      d3_geom_voronoiDetachBeach(lArc);
      lArc = previous;
    }
    disappearing.unshift(lArc);
    d3_geom_voronoiDetachCircle(lArc);
    var rArc = next;
    while (rArc.circle && abs(x - rArc.circle.x) < ε && abs(y - rArc.circle.cy) < ε) {
      next = rArc.N;
      disappearing.push(rArc);
      d3_geom_voronoiDetachBeach(rArc);
      rArc = next;
    }
    disappearing.push(rArc);
    d3_geom_voronoiDetachCircle(rArc);
    var nArcs = disappearing.length, iArc;
    for (iArc = 1; iArc < nArcs; ++iArc) {
      rArc = disappearing[iArc];
      lArc = disappearing[iArc - 1];
      d3_geom_voronoiSetEdgeEnd(rArc.edge, lArc.site, rArc.site, vertex);
    }
    lArc = disappearing[0];
    rArc = disappearing[nArcs - 1];
    rArc.edge = d3_geom_voronoiCreateEdge(lArc.site, rArc.site, null, vertex);
    d3_geom_voronoiAttachCircle(lArc);
    d3_geom_voronoiAttachCircle(rArc);
  }
  function d3_geom_voronoiAddBeach(site) {
    var x = site.x, directrix = site.y, lArc, rArc, dxl, dxr, node = d3_geom_voronoiBeaches._;
    while (node) {
      dxl = d3_geom_voronoiLeftBreakPoint(node, directrix) - x;
      if (dxl > ε) node = node.L; else {
        dxr = x - d3_geom_voronoiRightBreakPoint(node, directrix);
        if (dxr > ε) {
          if (!node.R) {
            lArc = node;
            break;
          }
          node = node.R;
        } else {
          if (dxl > -ε) {
            lArc = node.P;
            rArc = node;
          } else if (dxr > -ε) {
            lArc = node;
            rArc = node.N;
          } else {
            lArc = rArc = node;
          }
          break;
        }
      }
    }
    var newArc = d3_geom_voronoiCreateBeach(site);
    d3_geom_voronoiBeaches.insert(lArc, newArc);
    if (!lArc && !rArc) return;
    if (lArc === rArc) {
      d3_geom_voronoiDetachCircle(lArc);
      rArc = d3_geom_voronoiCreateBeach(lArc.site);
      d3_geom_voronoiBeaches.insert(newArc, rArc);
      newArc.edge = rArc.edge = d3_geom_voronoiCreateEdge(lArc.site, newArc.site);
      d3_geom_voronoiAttachCircle(lArc);
      d3_geom_voronoiAttachCircle(rArc);
      return;
    }
    if (!rArc) {
      newArc.edge = d3_geom_voronoiCreateEdge(lArc.site, newArc.site);
      return;
    }
    d3_geom_voronoiDetachCircle(lArc);
    d3_geom_voronoiDetachCircle(rArc);
    var lSite = lArc.site, ax = lSite.x, ay = lSite.y, bx = site.x - ax, by = site.y - ay, rSite = rArc.site, cx = rSite.x - ax, cy = rSite.y - ay, d = 2 * (bx * cy - by * cx), hb = bx * bx + by * by, hc = cx * cx + cy * cy, vertex = {
      x: (cy * hb - by * hc) / d + ax,
      y: (bx * hc - cx * hb) / d + ay
    };
    d3_geom_voronoiSetEdgeEnd(rArc.edge, lSite, rSite, vertex);
    newArc.edge = d3_geom_voronoiCreateEdge(lSite, site, null, vertex);
    rArc.edge = d3_geom_voronoiCreateEdge(site, rSite, null, vertex);
    d3_geom_voronoiAttachCircle(lArc);
    d3_geom_voronoiAttachCircle(rArc);
  }
  function d3_geom_voronoiLeftBreakPoint(arc, directrix) {
    var site = arc.site, rfocx = site.x, rfocy = site.y, pby2 = rfocy - directrix;
    if (!pby2) return rfocx;
    var lArc = arc.P;
    if (!lArc) return -Infinity;
    site = lArc.site;
    var lfocx = site.x, lfocy = site.y, plby2 = lfocy - directrix;
    if (!plby2) return lfocx;
    var hl = lfocx - rfocx, aby2 = 1 / pby2 - 1 / plby2, b = hl / plby2;
    if (aby2) return (-b + Math.sqrt(b * b - 2 * aby2 * (hl * hl / (-2 * plby2) - lfocy + plby2 / 2 + rfocy - pby2 / 2))) / aby2 + rfocx;
    return (rfocx + lfocx) / 2;
  }
  function d3_geom_voronoiRightBreakPoint(arc, directrix) {
    var rArc = arc.N;
    if (rArc) return d3_geom_voronoiLeftBreakPoint(rArc, directrix);
    var site = arc.site;
    return site.y === directrix ? site.x : Infinity;
  }
  function d3_geom_voronoiCell(site) {
    this.site = site;
    this.edges = [];
  }
  d3_geom_voronoiCell.prototype.prepare = function() {
    var halfEdges = this.edges, iHalfEdge = halfEdges.length, edge;
    while (iHalfEdge--) {
      edge = halfEdges[iHalfEdge].edge;
      if (!edge.b || !edge.a) halfEdges.splice(iHalfEdge, 1);
    }
    halfEdges.sort(d3_geom_voronoiHalfEdgeOrder);
    return halfEdges.length;
  };
  function d3_geom_voronoiCloseCells(extent) {
    var x0 = extent[0][0], x1 = extent[1][0], y0 = extent[0][1], y1 = extent[1][1], x2, y2, x3, y3, cells = d3_geom_voronoiCells, iCell = cells.length, cell, iHalfEdge, halfEdges, nHalfEdges, start, end;
    while (iCell--) {
      cell = cells[iCell];
      if (!cell || !cell.prepare()) continue;
      halfEdges = cell.edges;
      nHalfEdges = halfEdges.length;
      iHalfEdge = 0;
      while (iHalfEdge < nHalfEdges) {
        end = halfEdges[iHalfEdge].end(), x3 = end.x, y3 = end.y;
        start = halfEdges[++iHalfEdge % nHalfEdges].start(), x2 = start.x, y2 = start.y;
        if (abs(x3 - x2) > ε || abs(y3 - y2) > ε) {
          halfEdges.splice(iHalfEdge, 0, new d3_geom_voronoiHalfEdge(d3_geom_voronoiCreateBorderEdge(cell.site, end, abs(x3 - x0) < ε && y1 - y3 > ε ? {
            x: x0,
            y: abs(x2 - x0) < ε ? y2 : y1
          } : abs(y3 - y1) < ε && x1 - x3 > ε ? {
            x: abs(y2 - y1) < ε ? x2 : x1,
            y: y1
          } : abs(x3 - x1) < ε && y3 - y0 > ε ? {
            x: x1,
            y: abs(x2 - x1) < ε ? y2 : y0
          } : abs(y3 - y0) < ε && x3 - x0 > ε ? {
            x: abs(y2 - y0) < ε ? x2 : x0,
            y: y0
          } : null), cell.site, null));
          ++nHalfEdges;
        }
      }
    }
  }
  function d3_geom_voronoiHalfEdgeOrder(a, b) {
    return b.angle - a.angle;
  }
  function d3_geom_voronoiCircle() {
    d3_geom_voronoiRedBlackNode(this);
    this.x = this.y = this.arc = this.site = this.cy = null;
  }
  function d3_geom_voronoiAttachCircle(arc) {
    var lArc = arc.P, rArc = arc.N;
    if (!lArc || !rArc) return;
    var lSite = lArc.site, cSite = arc.site, rSite = rArc.site;
    if (lSite === rSite) return;
    var bx = cSite.x, by = cSite.y, ax = lSite.x - bx, ay = lSite.y - by, cx = rSite.x - bx, cy = rSite.y - by;
    var d = 2 * (ax * cy - ay * cx);
    if (d >= -ε2) return;
    var ha = ax * ax + ay * ay, hc = cx * cx + cy * cy, x = (cy * ha - ay * hc) / d, y = (ax * hc - cx * ha) / d, cy = y + by;
    var circle = d3_geom_voronoiCirclePool.pop() || new d3_geom_voronoiCircle();
    circle.arc = arc;
    circle.site = cSite;
    circle.x = x + bx;
    circle.y = cy + Math.sqrt(x * x + y * y);
    circle.cy = cy;
    arc.circle = circle;
    var before = null, node = d3_geom_voronoiCircles._;
    while (node) {
      if (circle.y < node.y || circle.y === node.y && circle.x <= node.x) {
        if (node.L) node = node.L; else {
          before = node.P;
          break;
        }
      } else {
        if (node.R) node = node.R; else {
          before = node;
          break;
        }
      }
    }
    d3_geom_voronoiCircles.insert(before, circle);
    if (!before) d3_geom_voronoiFirstCircle = circle;
  }
  function d3_geom_voronoiDetachCircle(arc) {
    var circle = arc.circle;
    if (circle) {
      if (!circle.P) d3_geom_voronoiFirstCircle = circle.N;
      d3_geom_voronoiCircles.remove(circle);
      d3_geom_voronoiCirclePool.push(circle);
      d3_geom_voronoiRedBlackNode(circle);
      arc.circle = null;
    }
  }
  function d3_geom_voronoiClipEdges(extent) {
    var edges = d3_geom_voronoiEdges, clip = d3_geom_clipLine(extent[0][0], extent[0][1], extent[1][0], extent[1][1]), i = edges.length, e;
    while (i--) {
      e = edges[i];
      if (!d3_geom_voronoiConnectEdge(e, extent) || !clip(e) || abs(e.a.x - e.b.x) < ε && abs(e.a.y - e.b.y) < ε) {
        e.a = e.b = null;
        edges.splice(i, 1);
      }
    }
  }
  function d3_geom_voronoiConnectEdge(edge, extent) {
    var vb = edge.b;
    if (vb) return true;
    var va = edge.a, x0 = extent[0][0], x1 = extent[1][0], y0 = extent[0][1], y1 = extent[1][1], lSite = edge.l, rSite = edge.r, lx = lSite.x, ly = lSite.y, rx = rSite.x, ry = rSite.y, fx = (lx + rx) / 2, fy = (ly + ry) / 2, fm, fb;
    if (ry === ly) {
      if (fx < x0 || fx >= x1) return;
      if (lx > rx) {
        if (!va) va = {
          x: fx,
          y: y0
        }; else if (va.y >= y1) return;
        vb = {
          x: fx,
          y: y1
        };
      } else {
        if (!va) va = {
          x: fx,
          y: y1
        }; else if (va.y < y0) return;
        vb = {
          x: fx,
          y: y0
        };
      }
    } else {
      fm = (lx - rx) / (ry - ly);
      fb = fy - fm * fx;
      if (fm < -1 || fm > 1) {
        if (lx > rx) {
          if (!va) va = {
            x: (y0 - fb) / fm,
            y: y0
          }; else if (va.y >= y1) return;
          vb = {
            x: (y1 - fb) / fm,
            y: y1
          };
        } else {
          if (!va) va = {
            x: (y1 - fb) / fm,
            y: y1
          }; else if (va.y < y0) return;
          vb = {
            x: (y0 - fb) / fm,
            y: y0
          };
        }
      } else {
        if (ly < ry) {
          if (!va) va = {
            x: x0,
            y: fm * x0 + fb
          }; else if (va.x >= x1) return;
          vb = {
            x: x1,
            y: fm * x1 + fb
          };
        } else {
          if (!va) va = {
            x: x1,
            y: fm * x1 + fb
          }; else if (va.x < x0) return;
          vb = {
            x: x0,
            y: fm * x0 + fb
          };
        }
      }
    }
    edge.a = va;
    edge.b = vb;
    return true;
  }
  function d3_geom_voronoiEdge(lSite, rSite) {
    this.l = lSite;
    this.r = rSite;
    this.a = this.b = null;
  }
  function d3_geom_voronoiCreateEdge(lSite, rSite, va, vb) {
    var edge = new d3_geom_voronoiEdge(lSite, rSite);
    d3_geom_voronoiEdges.push(edge);
    if (va) d3_geom_voronoiSetEdgeEnd(edge, lSite, rSite, va);
    if (vb) d3_geom_voronoiSetEdgeEnd(edge, rSite, lSite, vb);
    d3_geom_voronoiCells[lSite.i].edges.push(new d3_geom_voronoiHalfEdge(edge, lSite, rSite));
    d3_geom_voronoiCells[rSite.i].edges.push(new d3_geom_voronoiHalfEdge(edge, rSite, lSite));
    return edge;
  }
  function d3_geom_voronoiCreateBorderEdge(lSite, va, vb) {
    var edge = new d3_geom_voronoiEdge(lSite, null);
    edge.a = va;
    edge.b = vb;
    d3_geom_voronoiEdges.push(edge);
    return edge;
  }
  function d3_geom_voronoiSetEdgeEnd(edge, lSite, rSite, vertex) {
    if (!edge.a && !edge.b) {
      edge.a = vertex;
      edge.l = lSite;
      edge.r = rSite;
    } else if (edge.l === rSite) {
      edge.b = vertex;
    } else {
      edge.a = vertex;
    }
  }
  function d3_geom_voronoiHalfEdge(edge, lSite, rSite) {
    var va = edge.a, vb = edge.b;
    this.edge = edge;
    this.site = lSite;
    this.angle = rSite ? Math.atan2(rSite.y - lSite.y, rSite.x - lSite.x) : edge.l === lSite ? Math.atan2(vb.x - va.x, va.y - vb.y) : Math.atan2(va.x - vb.x, vb.y - va.y);
  }
  d3_geom_voronoiHalfEdge.prototype = {
    start: function() {
      return this.edge.l === this.site ? this.edge.a : this.edge.b;
    },
    end: function() {
      return this.edge.l === this.site ? this.edge.b : this.edge.a;
    }
  };
  function d3_geom_voronoiRedBlackTree() {
    this._ = null;
  }
  function d3_geom_voronoiRedBlackNode(node) {
    node.U = node.C = node.L = node.R = node.P = node.N = null;
  }
  d3_geom_voronoiRedBlackTree.prototype = {
    insert: function(after, node) {
      var parent, grandpa, uncle;
      if (after) {
        node.P = after;
        node.N = after.N;
        if (after.N) after.N.P = node;
        after.N = node;
        if (after.R) {
          after = after.R;
          while (after.L) after = after.L;
          after.L = node;
        } else {
          after.R = node;
        }
        parent = after;
      } else if (this._) {
        after = d3_geom_voronoiRedBlackFirst(this._);
        node.P = null;
        node.N = after;
        after.P = after.L = node;
        parent = after;
      } else {
        node.P = node.N = null;
        this._ = node;
        parent = null;
      }
      node.L = node.R = null;
      node.U = parent;
      node.C = true;
      after = node;
      while (parent && parent.C) {
        grandpa = parent.U;
        if (parent === grandpa.L) {
          uncle = grandpa.R;
          if (uncle && uncle.C) {
            parent.C = uncle.C = false;
            grandpa.C = true;
            after = grandpa;
          } else {
            if (after === parent.R) {
              d3_geom_voronoiRedBlackRotateLeft(this, parent);
              after = parent;
              parent = after.U;
            }
            parent.C = false;
            grandpa.C = true;
            d3_geom_voronoiRedBlackRotateRight(this, grandpa);
          }
        } else {
          uncle = grandpa.L;
          if (uncle && uncle.C) {
            parent.C = uncle.C = false;
            grandpa.C = true;
            after = grandpa;
          } else {
            if (after === parent.L) {
              d3_geom_voronoiRedBlackRotateRight(this, parent);
              after = parent;
              parent = after.U;
            }
            parent.C = false;
            grandpa.C = true;
            d3_geom_voronoiRedBlackRotateLeft(this, grandpa);
          }
        }
        parent = after.U;
      }
      this._.C = false;
    },
    remove: function(node) {
      if (node.N) node.N.P = node.P;
      if (node.P) node.P.N = node.N;
      node.N = node.P = null;
      var parent = node.U, sibling, left = node.L, right = node.R, next, red;
      if (!left) next = right; else if (!right) next = left; else next = d3_geom_voronoiRedBlackFirst(right);
      if (parent) {
        if (parent.L === node) parent.L = next; else parent.R = next;
      } else {
        this._ = next;
      }
      if (left && right) {
        red = next.C;
        next.C = node.C;
        next.L = left;
        left.U = next;
        if (next !== right) {
          parent = next.U;
          next.U = node.U;
          node = next.R;
          parent.L = node;
          next.R = right;
          right.U = next;
        } else {
          next.U = parent;
          parent = next;
          node = next.R;
        }
      } else {
        red = node.C;
        node = next;
      }
      if (node) node.U = parent;
      if (red) return;
      if (node && node.C) {
        node.C = false;
        return;
      }
      do {
        if (node === this._) break;
        if (node === parent.L) {
          sibling = parent.R;
          if (sibling.C) {
            sibling.C = false;
            parent.C = true;
            d3_geom_voronoiRedBlackRotateLeft(this, parent);
            sibling = parent.R;
          }
          if (sibling.L && sibling.L.C || sibling.R && sibling.R.C) {
            if (!sibling.R || !sibling.R.C) {
              sibling.L.C = false;
              sibling.C = true;
              d3_geom_voronoiRedBlackRotateRight(this, sibling);
              sibling = parent.R;
            }
            sibling.C = parent.C;
            parent.C = sibling.R.C = false;
            d3_geom_voronoiRedBlackRotateLeft(this, parent);
            node = this._;
            break;
          }
        } else {
          sibling = parent.L;
          if (sibling.C) {
            sibling.C = false;
            parent.C = true;
            d3_geom_voronoiRedBlackRotateRight(this, parent);
            sibling = parent.L;
          }
          if (sibling.L && sibling.L.C || sibling.R && sibling.R.C) {
            if (!sibling.L || !sibling.L.C) {
              sibling.R.C = false;
              sibling.C = true;
              d3_geom_voronoiRedBlackRotateLeft(this, sibling);
              sibling = parent.L;
            }
            sibling.C = parent.C;
            parent.C = sibling.L.C = false;
            d3_geom_voronoiRedBlackRotateRight(this, parent);
            node = this._;
            break;
          }
        }
        sibling.C = true;
        node = parent;
        parent = parent.U;
      } while (!node.C);
      if (node) node.C = false;
    }
  };
  function d3_geom_voronoiRedBlackRotateLeft(tree, node) {
    var p = node, q = node.R, parent = p.U;
    if (parent) {
      if (parent.L === p) parent.L = q; else parent.R = q;
    } else {
      tree._ = q;
    }
    q.U = parent;
    p.U = q;
    p.R = q.L;
    if (p.R) p.R.U = p;
    q.L = p;
  }
  function d3_geom_voronoiRedBlackRotateRight(tree, node) {
    var p = node, q = node.L, parent = p.U;
    if (parent) {
      if (parent.L === p) parent.L = q; else parent.R = q;
    } else {
      tree._ = q;
    }
    q.U = parent;
    p.U = q;
    p.L = q.R;
    if (p.L) p.L.U = p;
    q.R = p;
  }
  function d3_geom_voronoiRedBlackFirst(node) {
    while (node.L) node = node.L;
    return node;
  }
  function d3_geom_voronoi(sites, bbox) {
    var site = sites.sort(d3_geom_voronoiVertexOrder).pop(), x0, y0, circle;
    d3_geom_voronoiEdges = [];
    d3_geom_voronoiCells = new Array(sites.length);
    d3_geom_voronoiBeaches = new d3_geom_voronoiRedBlackTree();
    d3_geom_voronoiCircles = new d3_geom_voronoiRedBlackTree();
    while (true) {
      circle = d3_geom_voronoiFirstCircle;
      if (site && (!circle || site.y < circle.y || site.y === circle.y && site.x < circle.x)) {
        if (site.x !== x0 || site.y !== y0) {
          d3_geom_voronoiCells[site.i] = new d3_geom_voronoiCell(site);
          d3_geom_voronoiAddBeach(site);
          x0 = site.x, y0 = site.y;
        }
        site = sites.pop();
      } else if (circle) {
        d3_geom_voronoiRemoveBeach(circle.arc);
      } else {
        break;
      }
    }
    if (bbox) d3_geom_voronoiClipEdges(bbox), d3_geom_voronoiCloseCells(bbox);
    var diagram = {
      cells: d3_geom_voronoiCells,
      edges: d3_geom_voronoiEdges
    };
    d3_geom_voronoiBeaches = d3_geom_voronoiCircles = d3_geom_voronoiEdges = d3_geom_voronoiCells = null;
    return diagram;
  }
  function d3_geom_voronoiVertexOrder(a, b) {
    return b.y - a.y || b.x - a.x;
  }
  d3.geom.voronoi = function(points) {
    var x = d3_geom_pointX, y = d3_geom_pointY, fx = x, fy = y, clipExtent = d3_geom_voronoiClipExtent;
    if (points) return voronoi(points);
    function voronoi(data) {
      var polygons = new Array(data.length), x0 = clipExtent[0][0], y0 = clipExtent[0][1], x1 = clipExtent[1][0], y1 = clipExtent[1][1];
      d3_geom_voronoi(sites(data), clipExtent).cells.forEach(function(cell, i) {
        var edges = cell.edges, site = cell.site, polygon = polygons[i] = edges.length ? edges.map(function(e) {
          var s = e.start();
          return [ s.x, s.y ];
        }) : site.x >= x0 && site.x <= x1 && site.y >= y0 && site.y <= y1 ? [ [ x0, y1 ], [ x1, y1 ], [ x1, y0 ], [ x0, y0 ] ] : [];
        polygon.point = data[i];
      });
      return polygons;
    }
    function sites(data) {
      return data.map(function(d, i) {
        return {
          x: Math.round(fx(d, i) / ε) * ε,
          y: Math.round(fy(d, i) / ε) * ε,
          i: i
        };
      });
    }
    voronoi.links = function(data) {
      return d3_geom_voronoi(sites(data)).edges.filter(function(edge) {
        return edge.l && edge.r;
      }).map(function(edge) {
        return {
          source: data[edge.l.i],
          target: data[edge.r.i]
        };
      });
    };
    voronoi.triangles = function(data) {
      var triangles = [];
      d3_geom_voronoi(sites(data)).cells.forEach(function(cell, i) {
        var site = cell.site, edges = cell.edges.sort(d3_geom_voronoiHalfEdgeOrder), j = -1, m = edges.length, e0, s0, e1 = edges[m - 1].edge, s1 = e1.l === site ? e1.r : e1.l;
        while (++j < m) {
          e0 = e1;
          s0 = s1;
          e1 = edges[j].edge;
          s1 = e1.l === site ? e1.r : e1.l;
          if (i < s0.i && i < s1.i && d3_geom_voronoiTriangleArea(site, s0, s1) < 0) {
            triangles.push([ data[i], data[s0.i], data[s1.i] ]);
          }
        }
      });
      return triangles;
    };
    voronoi.x = function(_) {
      return arguments.length ? (fx = d3_functor(x = _), voronoi) : x;
    };
    voronoi.y = function(_) {
      return arguments.length ? (fy = d3_functor(y = _), voronoi) : y;
    };
    voronoi.clipExtent = function(_) {
      if (!arguments.length) return clipExtent === d3_geom_voronoiClipExtent ? null : clipExtent;
      clipExtent = _ == null ? d3_geom_voronoiClipExtent : _;
      return voronoi;
    };
    voronoi.size = function(_) {
      if (!arguments.length) return clipExtent === d3_geom_voronoiClipExtent ? null : clipExtent && clipExtent[1];
      return voronoi.clipExtent(_ && [ [ 0, 0 ], _ ]);
    };
    return voronoi;
  };
  var d3_geom_voronoiClipExtent = [ [ -1e6, -1e6 ], [ 1e6, 1e6 ] ];
  function d3_geom_voronoiTriangleArea(a, b, c) {
    return (a.x - c.x) * (b.y - a.y) - (a.x - b.x) * (c.y - a.y);
  }
  d3.geom.delaunay = function(vertices) {
    return d3.geom.voronoi().triangles(vertices);
  };
  d3.geom.quadtree = function(points, x1, y1, x2, y2) {
    var x = d3_geom_pointX, y = d3_geom_pointY, compat;
    if (compat = arguments.length) {
      x = d3_geom_quadtreeCompatX;
      y = d3_geom_quadtreeCompatY;
      if (compat === 3) {
        y2 = y1;
        x2 = x1;
        y1 = x1 = 0;
      }
      return quadtree(points);
    }
    function quadtree(data) {
      var d, fx = d3_functor(x), fy = d3_functor(y), xs, ys, i, n, x1_, y1_, x2_, y2_;
      if (x1 != null) {
        x1_ = x1, y1_ = y1, x2_ = x2, y2_ = y2;
      } else {
        x2_ = y2_ = -(x1_ = y1_ = Infinity);
        xs = [], ys = [];
        n = data.length;
        if (compat) for (i = 0; i < n; ++i) {
          d = data[i];
          if (d.x < x1_) x1_ = d.x;
          if (d.y < y1_) y1_ = d.y;
          if (d.x > x2_) x2_ = d.x;
          if (d.y > y2_) y2_ = d.y;
          xs.push(d.x);
          ys.push(d.y);
        } else for (i = 0; i < n; ++i) {
          var x_ = +fx(d = data[i], i), y_ = +fy(d, i);
          if (x_ < x1_) x1_ = x_;
          if (y_ < y1_) y1_ = y_;
          if (x_ > x2_) x2_ = x_;
          if (y_ > y2_) y2_ = y_;
          xs.push(x_);
          ys.push(y_);
        }
      }
      var dx = x2_ - x1_, dy = y2_ - y1_;
      if (dx > dy) y2_ = y1_ + dx; else x2_ = x1_ + dy;
      function insert(n, d, x, y, x1, y1, x2, y2) {
        if (isNaN(x) || isNaN(y)) return;
        if (n.leaf) {
          var nx = n.x, ny = n.y;
          if (nx != null) {
            if (abs(nx - x) + abs(ny - y) < .01) {
              insertChild(n, d, x, y, x1, y1, x2, y2);
            } else {
              var nPoint = n.point;
              n.x = n.y = n.point = null;
              insertChild(n, nPoint, nx, ny, x1, y1, x2, y2);
              insertChild(n, d, x, y, x1, y1, x2, y2);
            }
          } else {
            n.x = x, n.y = y, n.point = d;
          }
        } else {
          insertChild(n, d, x, y, x1, y1, x2, y2);
        }
      }
      function insertChild(n, d, x, y, x1, y1, x2, y2) {
        var xm = (x1 + x2) * .5, ym = (y1 + y2) * .5, right = x >= xm, below = y >= ym, i = below << 1 | right;
        n.leaf = false;
        n = n.nodes[i] || (n.nodes[i] = d3_geom_quadtreeNode());
        if (right) x1 = xm; else x2 = xm;
        if (below) y1 = ym; else y2 = ym;
        insert(n, d, x, y, x1, y1, x2, y2);
      }
      var root = d3_geom_quadtreeNode();
      root.add = function(d) {
        insert(root, d, +fx(d, ++i), +fy(d, i), x1_, y1_, x2_, y2_);
      };
      root.visit = function(f) {
        d3_geom_quadtreeVisit(f, root, x1_, y1_, x2_, y2_);
      };
      root.find = function(point) {
        return d3_geom_quadtreeFind(root, point[0], point[1], x1_, y1_, x2_, y2_);
      };
      i = -1;
      if (x1 == null) {
        while (++i < n) {
          insert(root, data[i], xs[i], ys[i], x1_, y1_, x2_, y2_);
        }
        --i;
      } else data.forEach(root.add);
      xs = ys = data = d = null;
      return root;
    }
    quadtree.x = function(_) {
      return arguments.length ? (x = _, quadtree) : x;
    };
    quadtree.y = function(_) {
      return arguments.length ? (y = _, quadtree) : y;
    };
    quadtree.extent = function(_) {
      if (!arguments.length) return x1 == null ? null : [ [ x1, y1 ], [ x2, y2 ] ];
      if (_ == null) x1 = y1 = x2 = y2 = null; else x1 = +_[0][0], y1 = +_[0][1], x2 = +_[1][0], 
      y2 = +_[1][1];
      return quadtree;
    };
    quadtree.size = function(_) {
      if (!arguments.length) return x1 == null ? null : [ x2 - x1, y2 - y1 ];
      if (_ == null) x1 = y1 = x2 = y2 = null; else x1 = y1 = 0, x2 = +_[0], y2 = +_[1];
      return quadtree;
    };
    return quadtree;
  };
  function d3_geom_quadtreeCompatX(d) {
    return d.x;
  }
  function d3_geom_quadtreeCompatY(d) {
    return d.y;
  }
  function d3_geom_quadtreeNode() {
    return {
      leaf: true,
      nodes: [],
      point: null,
      x: null,
      y: null
    };
  }
  function d3_geom_quadtreeVisit(f, node, x1, y1, x2, y2) {
    if (!f(node, x1, y1, x2, y2)) {
      var sx = (x1 + x2) * .5, sy = (y1 + y2) * .5, children = node.nodes;
      if (children[0]) d3_geom_quadtreeVisit(f, children[0], x1, y1, sx, sy);
      if (children[1]) d3_geom_quadtreeVisit(f, children[1], sx, y1, x2, sy);
      if (children[2]) d3_geom_quadtreeVisit(f, children[2], x1, sy, sx, y2);
      if (children[3]) d3_geom_quadtreeVisit(f, children[3], sx, sy, x2, y2);
    }
  }
  function d3_geom_quadtreeFind(root, x, y, x0, y0, x3, y3) {
    var minDistance2 = Infinity, closestPoint;
    (function find(node, x1, y1, x2, y2) {
      if (x1 > x3 || y1 > y3 || x2 < x0 || y2 < y0) return;
      if (point = node.point) {
        var point, dx = x - point[0], dy = y - point[1], distance2 = dx * dx + dy * dy;
        if (distance2 < minDistance2) {
          var distance = Math.sqrt(minDistance2 = distance2);
          x0 = x - distance, y0 = y - distance;
          x3 = x + distance, y3 = y + distance;
          closestPoint = point;
        }
      }
      var children = node.nodes, xm = (x1 + x2) * .5, ym = (y1 + y2) * .5, right = x >= xm, below = y >= ym;
      for (var i = below << 1 | right, j = i + 4; i < j; ++i) {
        if (node = children[i & 3]) switch (i & 3) {
         case 0:
          find(node, x1, y1, xm, ym);
          break;

         case 1:
          find(node, xm, y1, x2, ym);
          break;

         case 2:
          find(node, x1, ym, xm, y2);
          break;

         case 3:
          find(node, xm, ym, x2, y2);
          break;
        }
      }
    })(root, x0, y0, x3, y3);
    return closestPoint;
  }
  d3.interpolateRgb = d3_interpolateRgb;
  function d3_interpolateRgb(a, b) {
    a = d3.rgb(a);
    b = d3.rgb(b);
    var ar = a.r, ag = a.g, ab = a.b, br = b.r - ar, bg = b.g - ag, bb = b.b - ab;
    return function(t) {
      return "#" + d3_rgb_hex(Math.round(ar + br * t)) + d3_rgb_hex(Math.round(ag + bg * t)) + d3_rgb_hex(Math.round(ab + bb * t));
    };
  }
  d3.interpolateObject = d3_interpolateObject;
  function d3_interpolateObject(a, b) {
    var i = {}, c = {}, k;
    for (k in a) {
      if (k in b) {
        i[k] = d3_interpolate(a[k], b[k]);
      } else {
        c[k] = a[k];
      }
    }
    for (k in b) {
      if (!(k in a)) {
        c[k] = b[k];
      }
    }
    return function(t) {
      for (k in i) c[k] = i[k](t);
      return c;
    };
  }
  d3.interpolateNumber = d3_interpolateNumber;
  function d3_interpolateNumber(a, b) {
    a = +a, b = +b;
    return function(t) {
      return a * (1 - t) + b * t;
    };
  }
  d3.interpolateString = d3_interpolateString;
  function d3_interpolateString(a, b) {
    var bi = d3_interpolate_numberA.lastIndex = d3_interpolate_numberB.lastIndex = 0, am, bm, bs, i = -1, s = [], q = [];
    a = a + "", b = b + "";
    while ((am = d3_interpolate_numberA.exec(a)) && (bm = d3_interpolate_numberB.exec(b))) {
      if ((bs = bm.index) > bi) {
        bs = b.slice(bi, bs);
        if (s[i]) s[i] += bs; else s[++i] = bs;
      }
      if ((am = am[0]) === (bm = bm[0])) {
        if (s[i]) s[i] += bm; else s[++i] = bm;
      } else {
        s[++i] = null;
        q.push({
          i: i,
          x: d3_interpolateNumber(am, bm)
        });
      }
      bi = d3_interpolate_numberB.lastIndex;
    }
    if (bi < b.length) {
      bs = b.slice(bi);
      if (s[i]) s[i] += bs; else s[++i] = bs;
    }
    return s.length < 2 ? q[0] ? (b = q[0].x, function(t) {
      return b(t) + "";
    }) : function() {
      return b;
    } : (b = q.length, function(t) {
      for (var i = 0, o; i < b; ++i) s[(o = q[i]).i] = o.x(t);
      return s.join("");
    });
  }
  var d3_interpolate_numberA = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g, d3_interpolate_numberB = new RegExp(d3_interpolate_numberA.source, "g");
  d3.interpolate = d3_interpolate;
  function d3_interpolate(a, b) {
    var i = d3.interpolators.length, f;
    while (--i >= 0 && !(f = d3.interpolators[i](a, b))) ;
    return f;
  }
  d3.interpolators = [ function(a, b) {
    var t = typeof b;
    return (t === "string" ? d3_rgb_names.has(b) || /^(#|rgb\(|hsl\()/.test(b) ? d3_interpolateRgb : d3_interpolateString : b instanceof d3_color ? d3_interpolateRgb : Array.isArray(b) ? d3_interpolateArray : t === "object" && isNaN(b) ? d3_interpolateObject : d3_interpolateNumber)(a, b);
  } ];
  d3.interpolateArray = d3_interpolateArray;
  function d3_interpolateArray(a, b) {
    var x = [], c = [], na = a.length, nb = b.length, n0 = Math.min(a.length, b.length), i;
    for (i = 0; i < n0; ++i) x.push(d3_interpolate(a[i], b[i]));
    for (;i < na; ++i) c[i] = a[i];
    for (;i < nb; ++i) c[i] = b[i];
    return function(t) {
      for (i = 0; i < n0; ++i) c[i] = x[i](t);
      return c;
    };
  }
  var d3_ease_default = function() {
    return d3_identity;
  };
  var d3_ease = d3.map({
    linear: d3_ease_default,
    poly: d3_ease_poly,
    quad: function() {
      return d3_ease_quad;
    },
    cubic: function() {
      return d3_ease_cubic;
    },
    sin: function() {
      return d3_ease_sin;
    },
    exp: function() {
      return d3_ease_exp;
    },
    circle: function() {
      return d3_ease_circle;
    },
    elastic: d3_ease_elastic,
    back: d3_ease_back,
    bounce: function() {
      return d3_ease_bounce;
    }
  });
  var d3_ease_mode = d3.map({
    "in": d3_identity,
    out: d3_ease_reverse,
    "in-out": d3_ease_reflect,
    "out-in": function(f) {
      return d3_ease_reflect(d3_ease_reverse(f));
    }
  });
  d3.ease = function(name) {
    var i = name.indexOf("-"), t = i >= 0 ? name.slice(0, i) : name, m = i >= 0 ? name.slice(i + 1) : "in";
    t = d3_ease.get(t) || d3_ease_default;
    m = d3_ease_mode.get(m) || d3_identity;
    return d3_ease_clamp(m(t.apply(null, d3_arraySlice.call(arguments, 1))));
  };
  function d3_ease_clamp(f) {
    return function(t) {
      return t <= 0 ? 0 : t >= 1 ? 1 : f(t);
    };
  }
  function d3_ease_reverse(f) {
    return function(t) {
      return 1 - f(1 - t);
    };
  }
  function d3_ease_reflect(f) {
    return function(t) {
      return .5 * (t < .5 ? f(2 * t) : 2 - f(2 - 2 * t));
    };
  }
  function d3_ease_quad(t) {
    return t * t;
  }
  function d3_ease_cubic(t) {
    return t * t * t;
  }
  function d3_ease_cubicInOut(t) {
    if (t <= 0) return 0;
    if (t >= 1) return 1;
    var t2 = t * t, t3 = t2 * t;
    return 4 * (t < .5 ? t3 : 3 * (t - t2) + t3 - .75);
  }
  function d3_ease_poly(e) {
    return function(t) {
      return Math.pow(t, e);
    };
  }
  function d3_ease_sin(t) {
    return 1 - Math.cos(t * halfπ);
  }
  function d3_ease_exp(t) {
    return Math.pow(2, 10 * (t - 1));
  }
  function d3_ease_circle(t) {
    return 1 - Math.sqrt(1 - t * t);
  }
  function d3_ease_elastic(a, p) {
    var s;
    if (arguments.length < 2) p = .45;
    if (arguments.length) s = p / τ * Math.asin(1 / a); else a = 1, s = p / 4;
    return function(t) {
      return 1 + a * Math.pow(2, -10 * t) * Math.sin((t - s) * τ / p);
    };
  }
  function d3_ease_back(s) {
    if (!s) s = 1.70158;
    return function(t) {
      return t * t * ((s + 1) * t - s);
    };
  }
  function d3_ease_bounce(t) {
    return t < 1 / 2.75 ? 7.5625 * t * t : t < 2 / 2.75 ? 7.5625 * (t -= 1.5 / 2.75) * t + .75 : t < 2.5 / 2.75 ? 7.5625 * (t -= 2.25 / 2.75) * t + .9375 : 7.5625 * (t -= 2.625 / 2.75) * t + .984375;
  }
  d3.interpolateHcl = d3_interpolateHcl;
  function d3_interpolateHcl(a, b) {
    a = d3.hcl(a);
    b = d3.hcl(b);
    var ah = a.h, ac = a.c, al = a.l, bh = b.h - ah, bc = b.c - ac, bl = b.l - al;
    if (isNaN(bc)) bc = 0, ac = isNaN(ac) ? b.c : ac;
    if (isNaN(bh)) bh = 0, ah = isNaN(ah) ? b.h : ah; else if (bh > 180) bh -= 360; else if (bh < -180) bh += 360;
    return function(t) {
      return d3_hcl_lab(ah + bh * t, ac + bc * t, al + bl * t) + "";
    };
  }
  d3.interpolateHsl = d3_interpolateHsl;
  function d3_interpolateHsl(a, b) {
    a = d3.hsl(a);
    b = d3.hsl(b);
    var ah = a.h, as = a.s, al = a.l, bh = b.h - ah, bs = b.s - as, bl = b.l - al;
    if (isNaN(bs)) bs = 0, as = isNaN(as) ? b.s : as;
    if (isNaN(bh)) bh = 0, ah = isNaN(ah) ? b.h : ah; else if (bh > 180) bh -= 360; else if (bh < -180) bh += 360;
    return function(t) {
      return d3_hsl_rgb(ah + bh * t, as + bs * t, al + bl * t) + "";
    };
  }
  d3.interpolateLab = d3_interpolateLab;
  function d3_interpolateLab(a, b) {
    a = d3.lab(a);
    b = d3.lab(b);
    var al = a.l, aa = a.a, ab = a.b, bl = b.l - al, ba = b.a - aa, bb = b.b - ab;
    return function(t) {
      return d3_lab_rgb(al + bl * t, aa + ba * t, ab + bb * t) + "";
    };
  }
  d3.interpolateRound = d3_interpolateRound;
  function d3_interpolateRound(a, b) {
    b -= a;
    return function(t) {
      return Math.round(a + b * t);
    };
  }
  d3.transform = function(string) {
    var g = d3_document.createElementNS(d3.ns.prefix.svg, "g");
    return (d3.transform = function(string) {
      if (string != null) {
        g.setAttribute("transform", string);
        var t = g.transform.baseVal.consolidate();
      }
      return new d3_transform(t ? t.matrix : d3_transformIdentity);
    })(string);
  };
  function d3_transform(m) {
    var r0 = [ m.a, m.b ], r1 = [ m.c, m.d ], kx = d3_transformNormalize(r0), kz = d3_transformDot(r0, r1), ky = d3_transformNormalize(d3_transformCombine(r1, r0, -kz)) || 0;
    if (r0[0] * r1[1] < r1[0] * r0[1]) {
      r0[0] *= -1;
      r0[1] *= -1;
      kx *= -1;
      kz *= -1;
    }
    this.rotate = (kx ? Math.atan2(r0[1], r0[0]) : Math.atan2(-r1[0], r1[1])) * d3_degrees;
    this.translate = [ m.e, m.f ];
    this.scale = [ kx, ky ];
    this.skew = ky ? Math.atan2(kz, ky) * d3_degrees : 0;
  }
  d3_transform.prototype.toString = function() {
    return "translate(" + this.translate + ")rotate(" + this.rotate + ")skewX(" + this.skew + ")scale(" + this.scale + ")";
  };
  function d3_transformDot(a, b) {
    return a[0] * b[0] + a[1] * b[1];
  }
  function d3_transformNormalize(a) {
    var k = Math.sqrt(d3_transformDot(a, a));
    if (k) {
      a[0] /= k;
      a[1] /= k;
    }
    return k;
  }
  function d3_transformCombine(a, b, k) {
    a[0] += k * b[0];
    a[1] += k * b[1];
    return a;
  }
  var d3_transformIdentity = {
    a: 1,
    b: 0,
    c: 0,
    d: 1,
    e: 0,
    f: 0
  };
  d3.interpolateTransform = d3_interpolateTransform;
  function d3_interpolateTransform(a, b) {
    var s = [], q = [], n, A = d3.transform(a), B = d3.transform(b), ta = A.translate, tb = B.translate, ra = A.rotate, rb = B.rotate, wa = A.skew, wb = B.skew, ka = A.scale, kb = B.scale;
    if (ta[0] != tb[0] || ta[1] != tb[1]) {
      s.push("translate(", null, ",", null, ")");
      q.push({
        i: 1,
        x: d3_interpolateNumber(ta[0], tb[0])
      }, {
        i: 3,
        x: d3_interpolateNumber(ta[1], tb[1])
      });
    } else if (tb[0] || tb[1]) {
      s.push("translate(" + tb + ")");
    } else {
      s.push("");
    }
    if (ra != rb) {
      if (ra - rb > 180) rb += 360; else if (rb - ra > 180) ra += 360;
      q.push({
        i: s.push(s.pop() + "rotate(", null, ")") - 2,
        x: d3_interpolateNumber(ra, rb)
      });
    } else if (rb) {
      s.push(s.pop() + "rotate(" + rb + ")");
    }
    if (wa != wb) {
      q.push({
        i: s.push(s.pop() + "skewX(", null, ")") - 2,
        x: d3_interpolateNumber(wa, wb)
      });
    } else if (wb) {
      s.push(s.pop() + "skewX(" + wb + ")");
    }
    if (ka[0] != kb[0] || ka[1] != kb[1]) {
      n = s.push(s.pop() + "scale(", null, ",", null, ")");
      q.push({
        i: n - 4,
        x: d3_interpolateNumber(ka[0], kb[0])
      }, {
        i: n - 2,
        x: d3_interpolateNumber(ka[1], kb[1])
      });
    } else if (kb[0] != 1 || kb[1] != 1) {
      s.push(s.pop() + "scale(" + kb + ")");
    }
    n = q.length;
    return function(t) {
      var i = -1, o;
      while (++i < n) s[(o = q[i]).i] = o.x(t);
      return s.join("");
    };
  }
  function d3_uninterpolateNumber(a, b) {
    b = (b -= a = +a) || 1 / b;
    return function(x) {
      return (x - a) / b;
    };
  }
  function d3_uninterpolateClamp(a, b) {
    b = (b -= a = +a) || 1 / b;
    return function(x) {
      return Math.max(0, Math.min(1, (x - a) / b));
    };
  }
  d3.layout = {};
  d3.layout.bundle = function() {
    return function(links) {
      var paths = [], i = -1, n = links.length;
      while (++i < n) paths.push(d3_layout_bundlePath(links[i]));
      return paths;
    };
  };
  function d3_layout_bundlePath(link) {
    var start = link.source, end = link.target, lca = d3_layout_bundleLeastCommonAncestor(start, end), points = [ start ];
    while (start !== lca) {
      start = start.parent;
      points.push(start);
    }
    var k = points.length;
    while (end !== lca) {
      points.splice(k, 0, end);
      end = end.parent;
    }
    return points;
  }
  function d3_layout_bundleAncestors(node) {
    var ancestors = [], parent = node.parent;
    while (parent != null) {
      ancestors.push(node);
      node = parent;
      parent = parent.parent;
    }
    ancestors.push(node);
    return ancestors;
  }
  function d3_layout_bundleLeastCommonAncestor(a, b) {
    if (a === b) return a;
    var aNodes = d3_layout_bundleAncestors(a), bNodes = d3_layout_bundleAncestors(b), aNode = aNodes.pop(), bNode = bNodes.pop(), sharedNode = null;
    while (aNode === bNode) {
      sharedNode = aNode;
      aNode = aNodes.pop();
      bNode = bNodes.pop();
    }
    return sharedNode;
  }
  d3.layout.chord = function() {
    var chord = {}, chords, groups, matrix, n, padding = 0, sortGroups, sortSubgroups, sortChords;
    function relayout() {
      var subgroups = {}, groupSums = [], groupIndex = d3.range(n), subgroupIndex = [], k, x, x0, i, j;
      chords = [];
      groups = [];
      k = 0, i = -1;
      while (++i < n) {
        x = 0, j = -1;
        while (++j < n) {
          x += matrix[i][j];
        }
        groupSums.push(x);
        subgroupIndex.push(d3.range(n));
        k += x;
      }
      if (sortGroups) {
        groupIndex.sort(function(a, b) {
          return sortGroups(groupSums[a], groupSums[b]);
        });
      }
      if (sortSubgroups) {
        subgroupIndex.forEach(function(d, i) {
          d.sort(function(a, b) {
            return sortSubgroups(matrix[i][a], matrix[i][b]);
          });
        });
      }
      k = (τ - padding * n) / k;
      x = 0, i = -1;
      while (++i < n) {
        x0 = x, j = -1;
        while (++j < n) {
          var di = groupIndex[i], dj = subgroupIndex[di][j], v = matrix[di][dj], a0 = x, a1 = x += v * k;
          subgroups[di + "-" + dj] = {
            index: di,
            subindex: dj,
            startAngle: a0,
            endAngle: a1,
            value: v
          };
        }
        groups[di] = {
          index: di,
          startAngle: x0,
          endAngle: x,
          value: (x - x0) / k
        };
        x += padding;
      }
      i = -1;
      while (++i < n) {
        j = i - 1;
        while (++j < n) {
          var source = subgroups[i + "-" + j], target = subgroups[j + "-" + i];
          if (source.value || target.value) {
            chords.push(source.value < target.value ? {
              source: target,
              target: source
            } : {
              source: source,
              target: target
            });
          }
        }
      }
      if (sortChords) resort();
    }
    function resort() {
      chords.sort(function(a, b) {
        return sortChords((a.source.value + a.target.value) / 2, (b.source.value + b.target.value) / 2);
      });
    }
    chord.matrix = function(x) {
      if (!arguments.length) return matrix;
      n = (matrix = x) && matrix.length;
      chords = groups = null;
      return chord;
    };
    chord.padding = function(x) {
      if (!arguments.length) return padding;
      padding = x;
      chords = groups = null;
      return chord;
    };
    chord.sortGroups = function(x) {
      if (!arguments.length) return sortGroups;
      sortGroups = x;
      chords = groups = null;
      return chord;
    };
    chord.sortSubgroups = function(x) {
      if (!arguments.length) return sortSubgroups;
      sortSubgroups = x;
      chords = null;
      return chord;
    };
    chord.sortChords = function(x) {
      if (!arguments.length) return sortChords;
      sortChords = x;
      if (chords) resort();
      return chord;
    };
    chord.chords = function() {
      if (!chords) relayout();
      return chords;
    };
    chord.groups = function() {
      if (!groups) relayout();
      return groups;
    };
    return chord;
  };
  d3.layout.force = function() {
    var force = {}, event = d3.dispatch("start", "tick", "end"), size = [ 1, 1 ], drag, alpha, friction = .9, linkDistance = d3_layout_forceLinkDistance, linkStrength = d3_layout_forceLinkStrength, charge = -30, chargeDistance2 = d3_layout_forceChargeDistance2, gravity = .1, theta2 = .64, nodes = [], links = [], distances, strengths, charges;
    function repulse(node) {
      return function(quad, x1, _, x2) {
        if (quad.point !== node) {
          var dx = quad.cx - node.x, dy = quad.cy - node.y, dw = x2 - x1, dn = dx * dx + dy * dy;
          if (dw * dw / theta2 < dn) {
            if (dn < chargeDistance2) {
              var k = quad.charge / dn;
              node.px -= dx * k;
              node.py -= dy * k;
            }
            return true;
          }
          if (quad.point && dn && dn < chargeDistance2) {
            var k = quad.pointCharge / dn;
            node.px -= dx * k;
            node.py -= dy * k;
          }
        }
        return !quad.charge;
      };
    }
    force.tick = function() {
      if ((alpha *= .99) < .005) {
        event.end({
          type: "end",
          alpha: alpha = 0
        });
        return true;
      }
      var n = nodes.length, m = links.length, q, i, o, s, t, l, k, x, y;
      for (i = 0; i < m; ++i) {
        o = links[i];
        s = o.source;
        t = o.target;
        x = t.x - s.x;
        y = t.y - s.y;
        if (l = x * x + y * y) {
          l = alpha * strengths[i] * ((l = Math.sqrt(l)) - distances[i]) / l;
          x *= l;
          y *= l;
          t.x -= x * (k = s.weight / (t.weight + s.weight));
          t.y -= y * k;
          s.x += x * (k = 1 - k);
          s.y += y * k;
        }
      }
      if (k = alpha * gravity) {
        x = size[0] / 2;
        y = size[1] / 2;
        i = -1;
        if (k) while (++i < n) {
          o = nodes[i];
          o.x += (x - o.x) * k;
          o.y += (y - o.y) * k;
        }
      }
      if (charge) {
        d3_layout_forceAccumulate(q = d3.geom.quadtree(nodes), alpha, charges);
        i = -1;
        while (++i < n) {
          if (!(o = nodes[i]).fixed) {
            q.visit(repulse(o));
          }
        }
      }
      i = -1;
      while (++i < n) {
        o = nodes[i];
        if (o.fixed) {
          o.x = o.px;
          o.y = o.py;
        } else {
          o.x -= (o.px - (o.px = o.x)) * friction;
          o.y -= (o.py - (o.py = o.y)) * friction;
        }
      }
      event.tick({
        type: "tick",
        alpha: alpha
      });
    };
    force.nodes = function(x) {
      if (!arguments.length) return nodes;
      nodes = x;
      return force;
    };
    force.links = function(x) {
      if (!arguments.length) return links;
      links = x;
      return force;
    };
    force.size = function(x) {
      if (!arguments.length) return size;
      size = x;
      return force;
    };
    force.linkDistance = function(x) {
      if (!arguments.length) return linkDistance;
      linkDistance = typeof x === "function" ? x : +x;
      return force;
    };
    force.distance = force.linkDistance;
    force.linkStrength = function(x) {
      if (!arguments.length) return linkStrength;
      linkStrength = typeof x === "function" ? x : +x;
      return force;
    };
    force.friction = function(x) {
      if (!arguments.length) return friction;
      friction = +x;
      return force;
    };
    force.charge = function(x) {
      if (!arguments.length) return charge;
      charge = typeof x === "function" ? x : +x;
      return force;
    };
    force.chargeDistance = function(x) {
      if (!arguments.length) return Math.sqrt(chargeDistance2);
      chargeDistance2 = x * x;
      return force;
    };
    force.gravity = function(x) {
      if (!arguments.length) return gravity;
      gravity = +x;
      return force;
    };
    force.theta = function(x) {
      if (!arguments.length) return Math.sqrt(theta2);
      theta2 = x * x;
      return force;
    };
    force.alpha = function(x) {
      if (!arguments.length) return alpha;
      x = +x;
      if (alpha) {
        if (x > 0) alpha = x; else alpha = 0;
      } else if (x > 0) {
        event.start({
          type: "start",
          alpha: alpha = x
        });
        d3.timer(force.tick);
      }
      return force;
    };
    force.start = function() {
      var i, n = nodes.length, m = links.length, w = size[0], h = size[1], neighbors, o;
      for (i = 0; i < n; ++i) {
        (o = nodes[i]).index = i;
        o.weight = 0;
      }
      for (i = 0; i < m; ++i) {
        o = links[i];
        if (typeof o.source == "number") o.source = nodes[o.source];
        if (typeof o.target == "number") o.target = nodes[o.target];
        ++o.source.weight;
        ++o.target.weight;
      }
      for (i = 0; i < n; ++i) {
        o = nodes[i];
        if (isNaN(o.x)) o.x = position("x", w);
        if (isNaN(o.y)) o.y = position("y", h);
        if (isNaN(o.px)) o.px = o.x;
        if (isNaN(o.py)) o.py = o.y;
      }
      distances = [];
      if (typeof linkDistance === "function") for (i = 0; i < m; ++i) distances[i] = +linkDistance.call(this, links[i], i); else for (i = 0; i < m; ++i) distances[i] = linkDistance;
      strengths = [];
      if (typeof linkStrength === "function") for (i = 0; i < m; ++i) strengths[i] = +linkStrength.call(this, links[i], i); else for (i = 0; i < m; ++i) strengths[i] = linkStrength;
      charges = [];
      if (typeof charge === "function") for (i = 0; i < n; ++i) charges[i] = +charge.call(this, nodes[i], i); else for (i = 0; i < n; ++i) charges[i] = charge;
      function position(dimension, size) {
        if (!neighbors) {
          neighbors = new Array(n);
          for (j = 0; j < n; ++j) {
            neighbors[j] = [];
          }
          for (j = 0; j < m; ++j) {
            var o = links[j];
            neighbors[o.source.index].push(o.target);
            neighbors[o.target.index].push(o.source);
          }
        }
        var candidates = neighbors[i], j = -1, m = candidates.length, x;
        while (++j < m) if (!isNaN(x = candidates[j][dimension])) return x;
        return Math.random() * size;
      }
      return force.resume();
    };
    force.resume = function() {
      return force.alpha(.1);
    };
    force.stop = function() {
      return force.alpha(0);
    };
    force.drag = function() {
      if (!drag) drag = d3.behavior.drag().origin(d3_identity).on("dragstart.force", d3_layout_forceDragstart).on("drag.force", dragmove).on("dragend.force", d3_layout_forceDragend);
      if (!arguments.length) return drag;
      this.on("mouseover.force", d3_layout_forceMouseover).on("mouseout.force", d3_layout_forceMouseout).call(drag);
    };
    function dragmove(d) {
      d.px = d3.event.x, d.py = d3.event.y;
      force.resume();
    }
    return d3.rebind(force, event, "on");
  };
  function d3_layout_forceDragstart(d) {
    d.fixed |= 2;
  }
  function d3_layout_forceDragend(d) {
    d.fixed &= ~6;
  }
  function d3_layout_forceMouseover(d) {
    d.fixed |= 4;
    d.px = d.x, d.py = d.y;
  }
  function d3_layout_forceMouseout(d) {
    d.fixed &= ~4;
  }
  function d3_layout_forceAccumulate(quad, alpha, charges) {
    var cx = 0, cy = 0;
    quad.charge = 0;
    if (!quad.leaf) {
      var nodes = quad.nodes, n = nodes.length, i = -1, c;
      while (++i < n) {
        c = nodes[i];
        if (c == null) continue;
        d3_layout_forceAccumulate(c, alpha, charges);
        quad.charge += c.charge;
        cx += c.charge * c.cx;
        cy += c.charge * c.cy;
      }
    }
    if (quad.point) {
      if (!quad.leaf) {
        quad.point.x += Math.random() - .5;
        quad.point.y += Math.random() - .5;
      }
      var k = alpha * charges[quad.point.index];
      quad.charge += quad.pointCharge = k;
      cx += k * quad.point.x;
      cy += k * quad.point.y;
    }
    quad.cx = cx / quad.charge;
    quad.cy = cy / quad.charge;
  }
  var d3_layout_forceLinkDistance = 20, d3_layout_forceLinkStrength = 1, d3_layout_forceChargeDistance2 = Infinity;
  d3.layout.hierarchy = function() {
    var sort = d3_layout_hierarchySort, children = d3_layout_hierarchyChildren, value = d3_layout_hierarchyValue;
    function hierarchy(root) {
      var stack = [ root ], nodes = [], node;
      root.depth = 0;
      while ((node = stack.pop()) != null) {
        nodes.push(node);
        if ((childs = children.call(hierarchy, node, node.depth)) && (n = childs.length)) {
          var n, childs, child;
          while (--n >= 0) {
            stack.push(child = childs[n]);
            child.parent = node;
            child.depth = node.depth + 1;
          }
          if (value) node.value = 0;
          node.children = childs;
        } else {
          if (value) node.value = +value.call(hierarchy, node, node.depth) || 0;
          delete node.children;
        }
      }
      d3_layout_hierarchyVisitAfter(root, function(node) {
        var childs, parent;
        if (sort && (childs = node.children)) childs.sort(sort);
        if (value && (parent = node.parent)) parent.value += node.value;
      });
      return nodes;
    }
    hierarchy.sort = function(x) {
      if (!arguments.length) return sort;
      sort = x;
      return hierarchy;
    };
    hierarchy.children = function(x) {
      if (!arguments.length) return children;
      children = x;
      return hierarchy;
    };
    hierarchy.value = function(x) {
      if (!arguments.length) return value;
      value = x;
      return hierarchy;
    };
    hierarchy.revalue = function(root) {
      if (value) {
        d3_layout_hierarchyVisitBefore(root, function(node) {
          if (node.children) node.value = 0;
        });
        d3_layout_hierarchyVisitAfter(root, function(node) {
          var parent;
          if (!node.children) node.value = +value.call(hierarchy, node, node.depth) || 0;
          if (parent = node.parent) parent.value += node.value;
        });
      }
      return root;
    };
    return hierarchy;
  };
  function d3_layout_hierarchyRebind(object, hierarchy) {
    d3.rebind(object, hierarchy, "sort", "children", "value");
    object.nodes = object;
    object.links = d3_layout_hierarchyLinks;
    return object;
  }
  function d3_layout_hierarchyVisitBefore(node, callback) {
    var nodes = [ node ];
    while ((node = nodes.pop()) != null) {
      callback(node);
      if ((children = node.children) && (n = children.length)) {
        var n, children;
        while (--n >= 0) nodes.push(children[n]);
      }
    }
  }
  function d3_layout_hierarchyVisitAfter(node, callback) {
    var nodes = [ node ], nodes2 = [];
    while ((node = nodes.pop()) != null) {
      nodes2.push(node);
      if ((children = node.children) && (n = children.length)) {
        var i = -1, n, children;
        while (++i < n) nodes.push(children[i]);
      }
    }
    while ((node = nodes2.pop()) != null) {
      callback(node);
    }
  }
  function d3_layout_hierarchyChildren(d) {
    return d.children;
  }
  function d3_layout_hierarchyValue(d) {
    return d.value;
  }
  function d3_layout_hierarchySort(a, b) {
    return b.value - a.value;
  }
  function d3_layout_hierarchyLinks(nodes) {
    return d3.merge(nodes.map(function(parent) {
      return (parent.children || []).map(function(child) {
        return {
          source: parent,
          target: child
        };
      });
    }));
  }
  d3.layout.partition = function() {
    var hierarchy = d3.layout.hierarchy(), size = [ 1, 1 ];
    function position(node, x, dx, dy) {
      var children = node.children;
      node.x = x;
      node.y = node.depth * dy;
      node.dx = dx;
      node.dy = dy;
      if (children && (n = children.length)) {
        var i = -1, n, c, d;
        dx = node.value ? dx / node.value : 0;
        while (++i < n) {
          position(c = children[i], x, d = c.value * dx, dy);
          x += d;
        }
      }
    }
    function depth(node) {
      var children = node.children, d = 0;
      if (children && (n = children.length)) {
        var i = -1, n;
        while (++i < n) d = Math.max(d, depth(children[i]));
      }
      return 1 + d;
    }
    function partition(d, i) {
      var nodes = hierarchy.call(this, d, i);
      position(nodes[0], 0, size[0], size[1] / depth(nodes[0]));
      return nodes;
    }
    partition.size = function(x) {
      if (!arguments.length) return size;
      size = x;
      return partition;
    };
    return d3_layout_hierarchyRebind(partition, hierarchy);
  };
  d3.layout.pie = function() {
    var value = Number, sort = d3_layout_pieSortByValue, startAngle = 0, endAngle = τ, padAngle = 0;
    function pie(data) {
      var n = data.length, values = data.map(function(d, i) {
        return +value.call(pie, d, i);
      }), a = +(typeof startAngle === "function" ? startAngle.apply(this, arguments) : startAngle), da = (typeof endAngle === "function" ? endAngle.apply(this, arguments) : endAngle) - a, p = Math.min(Math.abs(da) / n, +(typeof padAngle === "function" ? padAngle.apply(this, arguments) : padAngle)), pa = p * (da < 0 ? -1 : 1), k = (da - n * pa) / d3.sum(values), index = d3.range(n), arcs = [], v;
      if (sort != null) index.sort(sort === d3_layout_pieSortByValue ? function(i, j) {
        return values[j] - values[i];
      } : function(i, j) {
        return sort(data[i], data[j]);
      });
      index.forEach(function(i) {
        arcs[i] = {
          data: data[i],
          value: v = values[i],
          startAngle: a,
          endAngle: a += v * k + pa,
          padAngle: p
        };
      });
      return arcs;
    }
    pie.value = function(_) {
      if (!arguments.length) return value;
      value = _;
      return pie;
    };
    pie.sort = function(_) {
      if (!arguments.length) return sort;
      sort = _;
      return pie;
    };
    pie.startAngle = function(_) {
      if (!arguments.length) return startAngle;
      startAngle = _;
      return pie;
    };
    pie.endAngle = function(_) {
      if (!arguments.length) return endAngle;
      endAngle = _;
      return pie;
    };
    pie.padAngle = function(_) {
      if (!arguments.length) return padAngle;
      padAngle = _;
      return pie;
    };
    return pie;
  };
  var d3_layout_pieSortByValue = {};
  d3.layout.stack = function() {
    var values = d3_identity, order = d3_layout_stackOrderDefault, offset = d3_layout_stackOffsetZero, out = d3_layout_stackOut, x = d3_layout_stackX, y = d3_layout_stackY;
    function stack(data, index) {
      if (!(n = data.length)) return data;
      var series = data.map(function(d, i) {
        return values.call(stack, d, i);
      });
      var points = series.map(function(d) {
        return d.map(function(v, i) {
          return [ x.call(stack, v, i), y.call(stack, v, i) ];
        });
      });
      var orders = order.call(stack, points, index);
      series = d3.permute(series, orders);
      points = d3.permute(points, orders);
      var offsets = offset.call(stack, points, index);
      var m = series[0].length, n, i, j, o;
      for (j = 0; j < m; ++j) {
        out.call(stack, series[0][j], o = offsets[j], points[0][j][1]);
        for (i = 1; i < n; ++i) {
          out.call(stack, series[i][j], o += points[i - 1][j][1], points[i][j][1]);
        }
      }
      return data;
    }
    stack.values = function(x) {
      if (!arguments.length) return values;
      values = x;
      return stack;
    };
    stack.order = function(x) {
      if (!arguments.length) return order;
      order = typeof x === "function" ? x : d3_layout_stackOrders.get(x) || d3_layout_stackOrderDefault;
      return stack;
    };
    stack.offset = function(x) {
      if (!arguments.length) return offset;
      offset = typeof x === "function" ? x : d3_layout_stackOffsets.get(x) || d3_layout_stackOffsetZero;
      return stack;
    };
    stack.x = function(z) {
      if (!arguments.length) return x;
      x = z;
      return stack;
    };
    stack.y = function(z) {
      if (!arguments.length) return y;
      y = z;
      return stack;
    };
    stack.out = function(z) {
      if (!arguments.length) return out;
      out = z;
      return stack;
    };
    return stack;
  };
  function d3_layout_stackX(d) {
    return d.x;
  }
  function d3_layout_stackY(d) {
    return d.y;
  }
  function d3_layout_stackOut(d, y0, y) {
    d.y0 = y0;
    d.y = y;
  }
  var d3_layout_stackOrders = d3.map({
    "inside-out": function(data) {
      var n = data.length, i, j, max = data.map(d3_layout_stackMaxIndex), sums = data.map(d3_layout_stackReduceSum), index = d3.range(n).sort(function(a, b) {
        return max[a] - max[b];
      }), top = 0, bottom = 0, tops = [], bottoms = [];
      for (i = 0; i < n; ++i) {
        j = index[i];
        if (top < bottom) {
          top += sums[j];
          tops.push(j);
        } else {
          bottom += sums[j];
          bottoms.push(j);
        }
      }
      return bottoms.reverse().concat(tops);
    },
    reverse: function(data) {
      return d3.range(data.length).reverse();
    },
    "default": d3_layout_stackOrderDefault
  });
  var d3_layout_stackOffsets = d3.map({
    silhouette: function(data) {
      var n = data.length, m = data[0].length, sums = [], max = 0, i, j, o, y0 = [];
      for (j = 0; j < m; ++j) {
        for (i = 0, o = 0; i < n; i++) o += data[i][j][1];
        if (o > max) max = o;
        sums.push(o);
      }
      for (j = 0; j < m; ++j) {
        y0[j] = (max - sums[j]) / 2;
      }
      return y0;
    },
    wiggle: function(data) {
      var n = data.length, x = data[0], m = x.length, i, j, k, s1, s2, s3, dx, o, o0, y0 = [];
      y0[0] = o = o0 = 0;
      for (j = 1; j < m; ++j) {
        for (i = 0, s1 = 0; i < n; ++i) s1 += data[i][j][1];
        for (i = 0, s2 = 0, dx = x[j][0] - x[j - 1][0]; i < n; ++i) {
          for (k = 0, s3 = (data[i][j][1] - data[i][j - 1][1]) / (2 * dx); k < i; ++k) {
            s3 += (data[k][j][1] - data[k][j - 1][1]) / dx;
          }
          s2 += s3 * data[i][j][1];
        }
        y0[j] = o -= s1 ? s2 / s1 * dx : 0;
        if (o < o0) o0 = o;
      }
      for (j = 0; j < m; ++j) y0[j] -= o0;
      return y0;
    },
    expand: function(data) {
      var n = data.length, m = data[0].length, k = 1 / n, i, j, o, y0 = [];
      for (j = 0; j < m; ++j) {
        for (i = 0, o = 0; i < n; i++) o += data[i][j][1];
        if (o) for (i = 0; i < n; i++) data[i][j][1] /= o; else for (i = 0; i < n; i++) data[i][j][1] = k;
      }
      for (j = 0; j < m; ++j) y0[j] = 0;
      return y0;
    },
    zero: d3_layout_stackOffsetZero
  });
  function d3_layout_stackOrderDefault(data) {
    return d3.range(data.length);
  }
  function d3_layout_stackOffsetZero(data) {
    var j = -1, m = data[0].length, y0 = [];
    while (++j < m) y0[j] = 0;
    return y0;
  }
  function d3_layout_stackMaxIndex(array) {
    var i = 1, j = 0, v = array[0][1], k, n = array.length;
    for (;i < n; ++i) {
      if ((k = array[i][1]) > v) {
        j = i;
        v = k;
      }
    }
    return j;
  }
  function d3_layout_stackReduceSum(d) {
    return d.reduce(d3_layout_stackSum, 0);
  }
  function d3_layout_stackSum(p, d) {
    return p + d[1];
  }
  d3.layout.histogram = function() {
    var frequency = true, valuer = Number, ranger = d3_layout_histogramRange, binner = d3_layout_histogramBinSturges;
    function histogram(data, i) {
      var bins = [], values = data.map(valuer, this), range = ranger.call(this, values, i), thresholds = binner.call(this, range, values, i), bin, i = -1, n = values.length, m = thresholds.length - 1, k = frequency ? 1 : 1 / n, x;
      while (++i < m) {
        bin = bins[i] = [];
        bin.dx = thresholds[i + 1] - (bin.x = thresholds[i]);
        bin.y = 0;
      }
      if (m > 0) {
        i = -1;
        while (++i < n) {
          x = values[i];
          if (x >= range[0] && x <= range[1]) {
            bin = bins[d3.bisect(thresholds, x, 1, m) - 1];
            bin.y += k;
            bin.push(data[i]);
          }
        }
      }
      return bins;
    }
    histogram.value = function(x) {
      if (!arguments.length) return valuer;
      valuer = x;
      return histogram;
    };
    histogram.range = function(x) {
      if (!arguments.length) return ranger;
      ranger = d3_functor(x);
      return histogram;
    };
    histogram.bins = function(x) {
      if (!arguments.length) return binner;
      binner = typeof x === "number" ? function(range) {
        return d3_layout_histogramBinFixed(range, x);
      } : d3_functor(x);
      return histogram;
    };
    histogram.frequency = function(x) {
      if (!arguments.length) return frequency;
      frequency = !!x;
      return histogram;
    };
    return histogram;
  };
  function d3_layout_histogramBinSturges(range, values) {
    return d3_layout_histogramBinFixed(range, Math.ceil(Math.log(values.length) / Math.LN2 + 1));
  }
  function d3_layout_histogramBinFixed(range, n) {
    var x = -1, b = +range[0], m = (range[1] - b) / n, f = [];
    while (++x <= n) f[x] = m * x + b;
    return f;
  }
  function d3_layout_histogramRange(values) {
    return [ d3.min(values), d3.max(values) ];
  }
  d3.layout.pack = function() {
    var hierarchy = d3.layout.hierarchy().sort(d3_layout_packSort), padding = 0, size = [ 1, 1 ], radius;
    function pack(d, i) {
      var nodes = hierarchy.call(this, d, i), root = nodes[0], w = size[0], h = size[1], r = radius == null ? Math.sqrt : typeof radius === "function" ? radius : function() {
        return radius;
      };
      root.x = root.y = 0;
      d3_layout_hierarchyVisitAfter(root, function(d) {
        d.r = +r(d.value);
      });
      d3_layout_hierarchyVisitAfter(root, d3_layout_packSiblings);
      if (padding) {
        var dr = padding * (radius ? 1 : Math.max(2 * root.r / w, 2 * root.r / h)) / 2;
        d3_layout_hierarchyVisitAfter(root, function(d) {
          d.r += dr;
        });
        d3_layout_hierarchyVisitAfter(root, d3_layout_packSiblings);
        d3_layout_hierarchyVisitAfter(root, function(d) {
          d.r -= dr;
        });
      }
      d3_layout_packTransform(root, w / 2, h / 2, radius ? 1 : 1 / Math.max(2 * root.r / w, 2 * root.r / h));
      return nodes;
    }
    pack.size = function(_) {
      if (!arguments.length) return size;
      size = _;
      return pack;
    };
    pack.radius = function(_) {
      if (!arguments.length) return radius;
      radius = _ == null || typeof _ === "function" ? _ : +_;
      return pack;
    };
    pack.padding = function(_) {
      if (!arguments.length) return padding;
      padding = +_;
      return pack;
    };
    return d3_layout_hierarchyRebind(pack, hierarchy);
  };
  function d3_layout_packSort(a, b) {
    return a.value - b.value;
  }
  function d3_layout_packInsert(a, b) {
    var c = a._pack_next;
    a._pack_next = b;
    b._pack_prev = a;
    b._pack_next = c;
    c._pack_prev = b;
  }
  function d3_layout_packSplice(a, b) {
    a._pack_next = b;
    b._pack_prev = a;
  }
  function d3_layout_packIntersects(a, b) {
    var dx = b.x - a.x, dy = b.y - a.y, dr = a.r + b.r;
    return .999 * dr * dr > dx * dx + dy * dy;
  }
  function d3_layout_packSiblings(node) {
    if (!(nodes = node.children) || !(n = nodes.length)) return;
    var nodes, xMin = Infinity, xMax = -Infinity, yMin = Infinity, yMax = -Infinity, a, b, c, i, j, k, n;
    function bound(node) {
      xMin = Math.min(node.x - node.r, xMin);
      xMax = Math.max(node.x + node.r, xMax);
      yMin = Math.min(node.y - node.r, yMin);
      yMax = Math.max(node.y + node.r, yMax);
    }
    nodes.forEach(d3_layout_packLink);
    a = nodes[0];
    a.x = -a.r;
    a.y = 0;
    bound(a);
    if (n > 1) {
      b = nodes[1];
      b.x = b.r;
      b.y = 0;
      bound(b);
      if (n > 2) {
        c = nodes[2];
        d3_layout_packPlace(a, b, c);
        bound(c);
        d3_layout_packInsert(a, c);
        a._pack_prev = c;
        d3_layout_packInsert(c, b);
        b = a._pack_next;
        for (i = 3; i < n; i++) {
          d3_layout_packPlace(a, b, c = nodes[i]);
          var isect = 0, s1 = 1, s2 = 1;
          for (j = b._pack_next; j !== b; j = j._pack_next, s1++) {
            if (d3_layout_packIntersects(j, c)) {
              isect = 1;
              break;
            }
          }
          if (isect == 1) {
            for (k = a._pack_prev; k !== j._pack_prev; k = k._pack_prev, s2++) {
              if (d3_layout_packIntersects(k, c)) {
                break;
              }
            }
          }
          if (isect) {
            if (s1 < s2 || s1 == s2 && b.r < a.r) d3_layout_packSplice(a, b = j); else d3_layout_packSplice(a = k, b);
            i--;
          } else {
            d3_layout_packInsert(a, c);
            b = c;
            bound(c);
          }
        }
      }
    }
    var cx = (xMin + xMax) / 2, cy = (yMin + yMax) / 2, cr = 0;
    for (i = 0; i < n; i++) {
      c = nodes[i];
      c.x -= cx;
      c.y -= cy;
      cr = Math.max(cr, c.r + Math.sqrt(c.x * c.x + c.y * c.y));
    }
    node.r = cr;
    nodes.forEach(d3_layout_packUnlink);
  }
  function d3_layout_packLink(node) {
    node._pack_next = node._pack_prev = node;
  }
  function d3_layout_packUnlink(node) {
    delete node._pack_next;
    delete node._pack_prev;
  }
  function d3_layout_packTransform(node, x, y, k) {
    var children = node.children;
    node.x = x += k * node.x;
    node.y = y += k * node.y;
    node.r *= k;
    if (children) {
      var i = -1, n = children.length;
      while (++i < n) d3_layout_packTransform(children[i], x, y, k);
    }
  }
  function d3_layout_packPlace(a, b, c) {
    var db = a.r + c.r, dx = b.x - a.x, dy = b.y - a.y;
    if (db && (dx || dy)) {
      var da = b.r + c.r, dc = dx * dx + dy * dy;
      da *= da;
      db *= db;
      var x = .5 + (db - da) / (2 * dc), y = Math.sqrt(Math.max(0, 2 * da * (db + dc) - (db -= dc) * db - da * da)) / (2 * dc);
      c.x = a.x + x * dx + y * dy;
      c.y = a.y + x * dy - y * dx;
    } else {
      c.x = a.x + db;
      c.y = a.y;
    }
  }
  d3.layout.tree = function() {
    var hierarchy = d3.layout.hierarchy().sort(null).value(null), separation = d3_layout_treeSeparation, size = [ 1, 1 ], nodeSize = null;
    function tree(d, i) {
      var nodes = hierarchy.call(this, d, i), root0 = nodes[0], root1 = wrapTree(root0);
      d3_layout_hierarchyVisitAfter(root1, firstWalk), root1.parent.m = -root1.z;
      d3_layout_hierarchyVisitBefore(root1, secondWalk);
      if (nodeSize) d3_layout_hierarchyVisitBefore(root0, sizeNode); else {
        var left = root0, right = root0, bottom = root0;
        d3_layout_hierarchyVisitBefore(root0, function(node) {
          if (node.x < left.x) left = node;
          if (node.x > right.x) right = node;
          if (node.depth > bottom.depth) bottom = node;
        });
        var tx = separation(left, right) / 2 - left.x, kx = size[0] / (right.x + separation(right, left) / 2 + tx), ky = size[1] / (bottom.depth || 1);
        d3_layout_hierarchyVisitBefore(root0, function(node) {
          node.x = (node.x + tx) * kx;
          node.y = node.depth * ky;
        });
      }
      return nodes;
    }
    function wrapTree(root0) {
      var root1 = {
        A: null,
        children: [ root0 ]
      }, queue = [ root1 ], node1;
      while ((node1 = queue.pop()) != null) {
        for (var children = node1.children, child, i = 0, n = children.length; i < n; ++i) {
          queue.push((children[i] = child = {
            _: children[i],
            parent: node1,
            children: (child = children[i].children) && child.slice() || [],
            A: null,
            a: null,
            z: 0,
            m: 0,
            c: 0,
            s: 0,
            t: null,
            i: i
          }).a = child);
        }
      }
      return root1.children[0];
    }
    function firstWalk(v) {
      var children = v.children, siblings = v.parent.children, w = v.i ? siblings[v.i - 1] : null;
      if (children.length) {
        d3_layout_treeShift(v);
        var midpoint = (children[0].z + children[children.length - 1].z) / 2;
        if (w) {
          v.z = w.z + separation(v._, w._);
          v.m = v.z - midpoint;
        } else {
          v.z = midpoint;
        }
      } else if (w) {
        v.z = w.z + separation(v._, w._);
      }
      v.parent.A = apportion(v, w, v.parent.A || siblings[0]);
    }
    function secondWalk(v) {
      v._.x = v.z + v.parent.m;
      v.m += v.parent.m;
    }
    function apportion(v, w, ancestor) {
      if (w) {
        var vip = v, vop = v, vim = w, vom = vip.parent.children[0], sip = vip.m, sop = vop.m, sim = vim.m, som = vom.m, shift;
        while (vim = d3_layout_treeRight(vim), vip = d3_layout_treeLeft(vip), vim && vip) {
          vom = d3_layout_treeLeft(vom);
          vop = d3_layout_treeRight(vop);
          vop.a = v;
          shift = vim.z + sim - vip.z - sip + separation(vim._, vip._);
          if (shift > 0) {
            d3_layout_treeMove(d3_layout_treeAncestor(vim, v, ancestor), v, shift);
            sip += shift;
            sop += shift;
          }
          sim += vim.m;
          sip += vip.m;
          som += vom.m;
          sop += vop.m;
        }
        if (vim && !d3_layout_treeRight(vop)) {
          vop.t = vim;
          vop.m += sim - sop;
        }
        if (vip && !d3_layout_treeLeft(vom)) {
          vom.t = vip;
          vom.m += sip - som;
          ancestor = v;
        }
      }
      return ancestor;
    }
    function sizeNode(node) {
      node.x *= size[0];
      node.y = node.depth * size[1];
    }
    tree.separation = function(x) {
      if (!arguments.length) return separation;
      separation = x;
      return tree;
    };
    tree.size = function(x) {
      if (!arguments.length) return nodeSize ? null : size;
      nodeSize = (size = x) == null ? sizeNode : null;
      return tree;
    };
    tree.nodeSize = function(x) {
      if (!arguments.length) return nodeSize ? size : null;
      nodeSize = (size = x) == null ? null : sizeNode;
      return tree;
    };
    return d3_layout_hierarchyRebind(tree, hierarchy);
  };
  function d3_layout_treeSeparation(a, b) {
    return a.parent == b.parent ? 1 : 2;
  }
  function d3_layout_treeLeft(v) {
    var children = v.children;
    return children.length ? children[0] : v.t;
  }
  function d3_layout_treeRight(v) {
    var children = v.children, n;
    return (n = children.length) ? children[n - 1] : v.t;
  }
  function d3_layout_treeMove(wm, wp, shift) {
    var change = shift / (wp.i - wm.i);
    wp.c -= change;
    wp.s += shift;
    wm.c += change;
    wp.z += shift;
    wp.m += shift;
  }
  function d3_layout_treeShift(v) {
    var shift = 0, change = 0, children = v.children, i = children.length, w;
    while (--i >= 0) {
      w = children[i];
      w.z += shift;
      w.m += shift;
      shift += w.s + (change += w.c);
    }
  }
  function d3_layout_treeAncestor(vim, v, ancestor) {
    return vim.a.parent === v.parent ? vim.a : ancestor;
  }
  d3.layout.cluster = function() {
    var hierarchy = d3.layout.hierarchy().sort(null).value(null), separation = d3_layout_treeSeparation, size = [ 1, 1 ], nodeSize = false;
    function cluster(d, i) {
      var nodes = hierarchy.call(this, d, i), root = nodes[0], previousNode, x = 0;
      d3_layout_hierarchyVisitAfter(root, function(node) {
        var children = node.children;
        if (children && children.length) {
          node.x = d3_layout_clusterX(children);
          node.y = d3_layout_clusterY(children);
        } else {
          node.x = previousNode ? x += separation(node, previousNode) : 0;
          node.y = 0;
          previousNode = node;
        }
      });
      var left = d3_layout_clusterLeft(root), right = d3_layout_clusterRight(root), x0 = left.x - separation(left, right) / 2, x1 = right.x + separation(right, left) / 2;
      d3_layout_hierarchyVisitAfter(root, nodeSize ? function(node) {
        node.x = (node.x - root.x) * size[0];
        node.y = (root.y - node.y) * size[1];
      } : function(node) {
        node.x = (node.x - x0) / (x1 - x0) * size[0];
        node.y = (1 - (root.y ? node.y / root.y : 1)) * size[1];
      });
      return nodes;
    }
    cluster.separation = function(x) {
      if (!arguments.length) return separation;
      separation = x;
      return cluster;
    };
    cluster.size = function(x) {
      if (!arguments.length) return nodeSize ? null : size;
      nodeSize = (size = x) == null;
      return cluster;
    };
    cluster.nodeSize = function(x) {
      if (!arguments.length) return nodeSize ? size : null;
      nodeSize = (size = x) != null;
      return cluster;
    };
    return d3_layout_hierarchyRebind(cluster, hierarchy);
  };
  function d3_layout_clusterY(children) {
    return 1 + d3.max(children, function(child) {
      return child.y;
    });
  }
  function d3_layout_clusterX(children) {
    return children.reduce(function(x, child) {
      return x + child.x;
    }, 0) / children.length;
  }
  function d3_layout_clusterLeft(node) {
    var children = node.children;
    return children && children.length ? d3_layout_clusterLeft(children[0]) : node;
  }
  function d3_layout_clusterRight(node) {
    var children = node.children, n;
    return children && (n = children.length) ? d3_layout_clusterRight(children[n - 1]) : node;
  }
  d3.layout.treemap = function() {
    var hierarchy = d3.layout.hierarchy(), round = Math.round, size = [ 1, 1 ], padding = null, pad = d3_layout_treemapPadNull, sticky = false, stickies, mode = "squarify", ratio = .5 * (1 + Math.sqrt(5));
    function scale(children, k) {
      var i = -1, n = children.length, child, area;
      while (++i < n) {
        area = (child = children[i]).value * (k < 0 ? 0 : k);
        child.area = isNaN(area) || area <= 0 ? 0 : area;
      }
    }
    function squarify(node) {
      var children = node.children;
      if (children && children.length) {
        var rect = pad(node), row = [], remaining = children.slice(), child, best = Infinity, score, u = mode === "slice" ? rect.dx : mode === "dice" ? rect.dy : mode === "slice-dice" ? node.depth & 1 ? rect.dy : rect.dx : Math.min(rect.dx, rect.dy), n;
        scale(remaining, rect.dx * rect.dy / node.value);
        row.area = 0;
        while ((n = remaining.length) > 0) {
          row.push(child = remaining[n - 1]);
          row.area += child.area;
          if (mode !== "squarify" || (score = worst(row, u)) <= best) {
            remaining.pop();
            best = score;
          } else {
            row.area -= row.pop().area;
            position(row, u, rect, false);
            u = Math.min(rect.dx, rect.dy);
            row.length = row.area = 0;
            best = Infinity;
          }
        }
        if (row.length) {
          position(row, u, rect, true);
          row.length = row.area = 0;
        }
        children.forEach(squarify);
      }
    }
    function stickify(node) {
      var children = node.children;
      if (children && children.length) {
        var rect = pad(node), remaining = children.slice(), child, row = [];
        scale(remaining, rect.dx * rect.dy / node.value);
        row.area = 0;
        while (child = remaining.pop()) {
          row.push(child);
          row.area += child.area;
          if (child.z != null) {
            position(row, child.z ? rect.dx : rect.dy, rect, !remaining.length);
            row.length = row.area = 0;
          }
        }
        children.forEach(stickify);
      }
    }
    function worst(row, u) {
      var s = row.area, r, rmax = 0, rmin = Infinity, i = -1, n = row.length;
      while (++i < n) {
        if (!(r = row[i].area)) continue;
        if (r < rmin) rmin = r;
        if (r > rmax) rmax = r;
      }
      s *= s;
      u *= u;
      return s ? Math.max(u * rmax * ratio / s, s / (u * rmin * ratio)) : Infinity;
    }
    function position(row, u, rect, flush) {
      var i = -1, n = row.length, x = rect.x, y = rect.y, v = u ? round(row.area / u) : 0, o;
      if (u == rect.dx) {
        if (flush || v > rect.dy) v = rect.dy;
        while (++i < n) {
          o = row[i];
          o.x = x;
          o.y = y;
          o.dy = v;
          x += o.dx = Math.min(rect.x + rect.dx - x, v ? round(o.area / v) : 0);
        }
        o.z = true;
        o.dx += rect.x + rect.dx - x;
        rect.y += v;
        rect.dy -= v;
      } else {
        if (flush || v > rect.dx) v = rect.dx;
        while (++i < n) {
          o = row[i];
          o.x = x;
          o.y = y;
          o.dx = v;
          y += o.dy = Math.min(rect.y + rect.dy - y, v ? round(o.area / v) : 0);
        }
        o.z = false;
        o.dy += rect.y + rect.dy - y;
        rect.x += v;
        rect.dx -= v;
      }
    }
    function treemap(d) {
      var nodes = stickies || hierarchy(d), root = nodes[0];
      root.x = 0;
      root.y = 0;
      root.dx = size[0];
      root.dy = size[1];
      if (stickies) hierarchy.revalue(root);
      scale([ root ], root.dx * root.dy / root.value);
      (stickies ? stickify : squarify)(root);
      if (sticky) stickies = nodes;
      return nodes;
    }
    treemap.size = function(x) {
      if (!arguments.length) return size;
      size = x;
      return treemap;
    };
    treemap.padding = function(x) {
      if (!arguments.length) return padding;
      function padFunction(node) {
        var p = x.call(treemap, node, node.depth);
        return p == null ? d3_layout_treemapPadNull(node) : d3_layout_treemapPad(node, typeof p === "number" ? [ p, p, p, p ] : p);
      }
      function padConstant(node) {
        return d3_layout_treemapPad(node, x);
      }
      var type;
      pad = (padding = x) == null ? d3_layout_treemapPadNull : (type = typeof x) === "function" ? padFunction : type === "number" ? (x = [ x, x, x, x ], 
      padConstant) : padConstant;
      return treemap;
    };
    treemap.round = function(x) {
      if (!arguments.length) return round != Number;
      round = x ? Math.round : Number;
      return treemap;
    };
    treemap.sticky = function(x) {
      if (!arguments.length) return sticky;
      sticky = x;
      stickies = null;
      return treemap;
    };
    treemap.ratio = function(x) {
      if (!arguments.length) return ratio;
      ratio = x;
      return treemap;
    };
    treemap.mode = function(x) {
      if (!arguments.length) return mode;
      mode = x + "";
      return treemap;
    };
    return d3_layout_hierarchyRebind(treemap, hierarchy);
  };
  function d3_layout_treemapPadNull(node) {
    return {
      x: node.x,
      y: node.y,
      dx: node.dx,
      dy: node.dy
    };
  }
  function d3_layout_treemapPad(node, padding) {
    var x = node.x + padding[3], y = node.y + padding[0], dx = node.dx - padding[1] - padding[3], dy = node.dy - padding[0] - padding[2];
    if (dx < 0) {
      x += dx / 2;
      dx = 0;
    }
    if (dy < 0) {
      y += dy / 2;
      dy = 0;
    }
    return {
      x: x,
      y: y,
      dx: dx,
      dy: dy
    };
  }
  d3.random = {
    normal: function(µ, σ) {
      var n = arguments.length;
      if (n < 2) σ = 1;
      if (n < 1) µ = 0;
      return function() {
        var x, y, r;
        do {
          x = Math.random() * 2 - 1;
          y = Math.random() * 2 - 1;
          r = x * x + y * y;
        } while (!r || r > 1);
        return µ + σ * x * Math.sqrt(-2 * Math.log(r) / r);
      };
    },
    logNormal: function() {
      var random = d3.random.normal.apply(d3, arguments);
      return function() {
        return Math.exp(random());
      };
    },
    bates: function(m) {
      var random = d3.random.irwinHall(m);
      return function() {
        return random() / m;
      };
    },
    irwinHall: function(m) {
      return function() {
        for (var s = 0, j = 0; j < m; j++) s += Math.random();
        return s;
      };
    }
  };
  d3.scale = {};
  function d3_scaleExtent(domain) {
    var start = domain[0], stop = domain[domain.length - 1];
    return start < stop ? [ start, stop ] : [ stop, start ];
  }
  function d3_scaleRange(scale) {
    return scale.rangeExtent ? scale.rangeExtent() : d3_scaleExtent(scale.range());
  }
  function d3_scale_bilinear(domain, range, uninterpolate, interpolate) {
    var u = uninterpolate(domain[0], domain[1]), i = interpolate(range[0], range[1]);
    return function(x) {
      return i(u(x));
    };
  }
  function d3_scale_nice(domain, nice) {
    var i0 = 0, i1 = domain.length - 1, x0 = domain[i0], x1 = domain[i1], dx;
    if (x1 < x0) {
      dx = i0, i0 = i1, i1 = dx;
      dx = x0, x0 = x1, x1 = dx;
    }
    domain[i0] = nice.floor(x0);
    domain[i1] = nice.ceil(x1);
    return domain;
  }
  function d3_scale_niceStep(step) {
    return step ? {
      floor: function(x) {
        return Math.floor(x / step) * step;
      },
      ceil: function(x) {
        return Math.ceil(x / step) * step;
      }
    } : d3_scale_niceIdentity;
  }
  var d3_scale_niceIdentity = {
    floor: d3_identity,
    ceil: d3_identity
  };
  function d3_scale_polylinear(domain, range, uninterpolate, interpolate) {
    var u = [], i = [], j = 0, k = Math.min(domain.length, range.length) - 1;
    if (domain[k] < domain[0]) {
      domain = domain.slice().reverse();
      range = range.slice().reverse();
    }
    while (++j <= k) {
      u.push(uninterpolate(domain[j - 1], domain[j]));
      i.push(interpolate(range[j - 1], range[j]));
    }
    return function(x) {
      var j = d3.bisect(domain, x, 1, k) - 1;
      return i[j](u[j](x));
    };
  }
  d3.scale.linear = function() {
    return d3_scale_linear([ 0, 1 ], [ 0, 1 ], d3_interpolate, false);
  };
  function d3_scale_linear(domain, range, interpolate, clamp) {
    var output, input;
    function rescale() {
      var linear = Math.min(domain.length, range.length) > 2 ? d3_scale_polylinear : d3_scale_bilinear, uninterpolate = clamp ? d3_uninterpolateClamp : d3_uninterpolateNumber;
      output = linear(domain, range, uninterpolate, interpolate);
      input = linear(range, domain, uninterpolate, d3_interpolate);
      return scale;
    }
    function scale(x) {
      return output(x);
    }
    scale.invert = function(y) {
      return input(y);
    };
    scale.domain = function(x) {
      if (!arguments.length) return domain;
      domain = x.map(Number);
      return rescale();
    };
    scale.range = function(x) {
      if (!arguments.length) return range;
      range = x;
      return rescale();
    };
    scale.rangeRound = function(x) {
      return scale.range(x).interpolate(d3_interpolateRound);
    };
    scale.clamp = function(x) {
      if (!arguments.length) return clamp;
      clamp = x;
      return rescale();
    };
    scale.interpolate = function(x) {
      if (!arguments.length) return interpolate;
      interpolate = x;
      return rescale();
    };
    scale.ticks = function(m) {
      return d3_scale_linearTicks(domain, m);
    };
    scale.tickFormat = function(m, format) {
      return d3_scale_linearTickFormat(domain, m, format);
    };
    scale.nice = function(m) {
      d3_scale_linearNice(domain, m);
      return rescale();
    };
    scale.copy = function() {
      return d3_scale_linear(domain, range, interpolate, clamp);
    };
    return rescale();
  }
  function d3_scale_linearRebind(scale, linear) {
    return d3.rebind(scale, linear, "range", "rangeRound", "interpolate", "clamp");
  }
  function d3_scale_linearNice(domain, m) {
    return d3_scale_nice(domain, d3_scale_niceStep(d3_scale_linearTickRange(domain, m)[2]));
  }
  function d3_scale_linearTickRange(domain, m) {
    if (m == null) m = 10;
    var extent = d3_scaleExtent(domain), span = extent[1] - extent[0], step = Math.pow(10, Math.floor(Math.log(span / m) / Math.LN10)), err = m / span * step;
    if (err <= .15) step *= 10; else if (err <= .35) step *= 5; else if (err <= .75) step *= 2;
    extent[0] = Math.ceil(extent[0] / step) * step;
    extent[1] = Math.floor(extent[1] / step) * step + step * .5;
    extent[2] = step;
    return extent;
  }
  function d3_scale_linearTicks(domain, m) {
    return d3.range.apply(d3, d3_scale_linearTickRange(domain, m));
  }
  function d3_scale_linearTickFormat(domain, m, format) {
    var range = d3_scale_linearTickRange(domain, m);
    if (format) {
      var match = d3_format_re.exec(format);
      match.shift();
      if (match[8] === "s") {
        var prefix = d3.formatPrefix(Math.max(abs(range[0]), abs(range[1])));
        if (!match[7]) match[7] = "." + d3_scale_linearPrecision(prefix.scale(range[2]));
        match[8] = "f";
        format = d3.format(match.join(""));
        return function(d) {
          return format(prefix.scale(d)) + prefix.symbol;
        };
      }
      if (!match[7]) match[7] = "." + d3_scale_linearFormatPrecision(match[8], range);
      format = match.join("");
    } else {
      format = ",." + d3_scale_linearPrecision(range[2]) + "f";
    }
    return d3.format(format);
  }
  var d3_scale_linearFormatSignificant = {
    s: 1,
    g: 1,
    p: 1,
    r: 1,
    e: 1
  };
  function d3_scale_linearPrecision(value) {
    return -Math.floor(Math.log(value) / Math.LN10 + .01);
  }
  function d3_scale_linearFormatPrecision(type, range) {
    var p = d3_scale_linearPrecision(range[2]);
    return type in d3_scale_linearFormatSignificant ? Math.abs(p - d3_scale_linearPrecision(Math.max(abs(range[0]), abs(range[1])))) + +(type !== "e") : p - (type === "%") * 2;
  }
  d3.scale.log = function() {
    return d3_scale_log(d3.scale.linear().domain([ 0, 1 ]), 10, true, [ 1, 10 ]);
  };
  function d3_scale_log(linear, base, positive, domain) {
    function log(x) {
      return (positive ? Math.log(x < 0 ? 0 : x) : -Math.log(x > 0 ? 0 : -x)) / Math.log(base);
    }
    function pow(x) {
      return positive ? Math.pow(base, x) : -Math.pow(base, -x);
    }
    function scale(x) {
      return linear(log(x));
    }
    scale.invert = function(x) {
      return pow(linear.invert(x));
    };
    scale.domain = function(x) {
      if (!arguments.length) return domain;
      positive = x[0] >= 0;
      linear.domain((domain = x.map(Number)).map(log));
      return scale;
    };
    scale.base = function(_) {
      if (!arguments.length) return base;
      base = +_;
      linear.domain(domain.map(log));
      return scale;
    };
    scale.nice = function() {
      var niced = d3_scale_nice(domain.map(log), positive ? Math : d3_scale_logNiceNegative);
      linear.domain(niced);
      domain = niced.map(pow);
      return scale;
    };
    scale.ticks = function() {
      var extent = d3_scaleExtent(domain), ticks = [], u = extent[0], v = extent[1], i = Math.floor(log(u)), j = Math.ceil(log(v)), n = base % 1 ? 2 : base;
      if (isFinite(j - i)) {
        if (positive) {
          for (;i < j; i++) for (var k = 1; k < n; k++) ticks.push(pow(i) * k);
          ticks.push(pow(i));
        } else {
          ticks.push(pow(i));
          for (;i++ < j; ) for (var k = n - 1; k > 0; k--) ticks.push(pow(i) * k);
        }
        for (i = 0; ticks[i] < u; i++) {}
        for (j = ticks.length; ticks[j - 1] > v; j--) {}
        ticks = ticks.slice(i, j);
      }
      return ticks;
    };
    scale.tickFormat = function(n, format) {
      if (!arguments.length) return d3_scale_logFormat;
      if (arguments.length < 2) format = d3_scale_logFormat; else if (typeof format !== "function") format = d3.format(format);
      var k = Math.max(.1, n / scale.ticks().length), f = positive ? (e = 1e-12, Math.ceil) : (e = -1e-12, 
      Math.floor), e;
      return function(d) {
        return d / pow(f(log(d) + e)) <= k ? format(d) : "";
      };
    };
    scale.copy = function() {
      return d3_scale_log(linear.copy(), base, positive, domain);
    };
    return d3_scale_linearRebind(scale, linear);
  }
  var d3_scale_logFormat = d3.format(".0e"), d3_scale_logNiceNegative = {
    floor: function(x) {
      return -Math.ceil(-x);
    },
    ceil: function(x) {
      return -Math.floor(-x);
    }
  };
  d3.scale.pow = function() {
    return d3_scale_pow(d3.scale.linear(), 1, [ 0, 1 ]);
  };
  function d3_scale_pow(linear, exponent, domain) {
    var powp = d3_scale_powPow(exponent), powb = d3_scale_powPow(1 / exponent);
    function scale(x) {
      return linear(powp(x));
    }
    scale.invert = function(x) {
      return powb(linear.invert(x));
    };
    scale.domain = function(x) {
      if (!arguments.length) return domain;
      linear.domain((domain = x.map(Number)).map(powp));
      return scale;
    };
    scale.ticks = function(m) {
      return d3_scale_linearTicks(domain, m);
    };
    scale.tickFormat = function(m, format) {
      return d3_scale_linearTickFormat(domain, m, format);
    };
    scale.nice = function(m) {
      return scale.domain(d3_scale_linearNice(domain, m));
    };
    scale.exponent = function(x) {
      if (!arguments.length) return exponent;
      powp = d3_scale_powPow(exponent = x);
      powb = d3_scale_powPow(1 / exponent);
      linear.domain(domain.map(powp));
      return scale;
    };
    scale.copy = function() {
      return d3_scale_pow(linear.copy(), exponent, domain);
    };
    return d3_scale_linearRebind(scale, linear);
  }
  function d3_scale_powPow(e) {
    return function(x) {
      return x < 0 ? -Math.pow(-x, e) : Math.pow(x, e);
    };
  }
  d3.scale.sqrt = function() {
    return d3.scale.pow().exponent(.5);
  };
  d3.scale.ordinal = function() {
    return d3_scale_ordinal([], {
      t: "range",
      a: [ [] ]
    });
  };
  function d3_scale_ordinal(domain, ranger) {
    var index, range, rangeBand;
    function scale(x) {
      return range[((index.get(x) || (ranger.t === "range" ? index.set(x, domain.push(x)) : NaN)) - 1) % range.length];
    }
    function steps(start, step) {
      return d3.range(domain.length).map(function(i) {
        return start + step * i;
      });
    }
    scale.domain = function(x) {
      if (!arguments.length) return domain;
      domain = [];
      index = new d3_Map();
      var i = -1, n = x.length, xi;
      while (++i < n) if (!index.has(xi = x[i])) index.set(xi, domain.push(xi));
      return scale[ranger.t].apply(scale, ranger.a);
    };
    scale.range = function(x) {
      if (!arguments.length) return range;
      range = x;
      rangeBand = 0;
      ranger = {
        t: "range",
        a: arguments
      };
      return scale;
    };
    scale.rangePoints = function(x, padding) {
      if (arguments.length < 2) padding = 0;
      var start = x[0], stop = x[1], step = domain.length < 2 ? (start = (start + stop) / 2, 
      0) : (stop - start) / (domain.length - 1 + padding);
      range = steps(start + step * padding / 2, step);
      rangeBand = 0;
      ranger = {
        t: "rangePoints",
        a: arguments
      };
      return scale;
    };
    scale.rangeRoundPoints = function(x, padding) {
      if (arguments.length < 2) padding = 0;
      var start = x[0], stop = x[1], step = domain.length < 2 ? (start = stop = Math.round((start + stop) / 2), 
      0) : (stop - start) / (domain.length - 1 + padding) | 0;
      range = steps(start + Math.round(step * padding / 2 + (stop - start - (domain.length - 1 + padding) * step) / 2), step);
      rangeBand = 0;
      ranger = {
        t: "rangeRoundPoints",
        a: arguments
      };
      return scale;
    };
    scale.rangeBands = function(x, padding, outerPadding) {
      if (arguments.length < 2) padding = 0;
      if (arguments.length < 3) outerPadding = padding;
      var reverse = x[1] < x[0], start = x[reverse - 0], stop = x[1 - reverse], step = (stop - start) / (domain.length - padding + 2 * outerPadding);
      range = steps(start + step * outerPadding, step);
      if (reverse) range.reverse();
      rangeBand = step * (1 - padding);
      ranger = {
        t: "rangeBands",
        a: arguments
      };
      return scale;
    };
    scale.rangeRoundBands = function(x, padding, outerPadding) {
      if (arguments.length < 2) padding = 0;
      if (arguments.length < 3) outerPadding = padding;
      var reverse = x[1] < x[0], start = x[reverse - 0], stop = x[1 - reverse], step = Math.floor((stop - start) / (domain.length - padding + 2 * outerPadding));
      range = steps(start + Math.round((stop - start - (domain.length - padding) * step) / 2), step);
      if (reverse) range.reverse();
      rangeBand = Math.round(step * (1 - padding));
      ranger = {
        t: "rangeRoundBands",
        a: arguments
      };
      return scale;
    };
    scale.rangeBand = function() {
      return rangeBand;
    };
    scale.rangeExtent = function() {
      return d3_scaleExtent(ranger.a[0]);
    };
    scale.copy = function() {
      return d3_scale_ordinal(domain, ranger);
    };
    return scale.domain(domain);
  }
  d3.scale.category10 = function() {
    return d3.scale.ordinal().range(d3_category10);
  };
  d3.scale.category20 = function() {
    return d3.scale.ordinal().range(d3_category20);
  };
  d3.scale.category20b = function() {
    return d3.scale.ordinal().range(d3_category20b);
  };
  d3.scale.category20c = function() {
    return d3.scale.ordinal().range(d3_category20c);
  };
  var d3_category10 = [ 2062260, 16744206, 2924588, 14034728, 9725885, 9197131, 14907330, 8355711, 12369186, 1556175 ].map(d3_rgbString);
  var d3_category20 = [ 2062260, 11454440, 16744206, 16759672, 2924588, 10018698, 14034728, 16750742, 9725885, 12955861, 9197131, 12885140, 14907330, 16234194, 8355711, 13092807, 12369186, 14408589, 1556175, 10410725 ].map(d3_rgbString);
  var d3_category20b = [ 3750777, 5395619, 7040719, 10264286, 6519097, 9216594, 11915115, 13556636, 9202993, 12426809, 15186514, 15190932, 8666169, 11356490, 14049643, 15177372, 8077683, 10834324, 13528509, 14589654 ].map(d3_rgbString);
  var d3_category20c = [ 3244733, 7057110, 10406625, 13032431, 15095053, 16616764, 16625259, 16634018, 3253076, 7652470, 10607003, 13101504, 7695281, 10394312, 12369372, 14342891, 6513507, 9868950, 12434877, 14277081 ].map(d3_rgbString);
  d3.scale.quantile = function() {
    return d3_scale_quantile([], []);
  };
  function d3_scale_quantile(domain, range) {
    var thresholds;
    function rescale() {
      var k = 0, q = range.length;
      thresholds = [];
      while (++k < q) thresholds[k - 1] = d3.quantile(domain, k / q);
      return scale;
    }
    function scale(x) {
      if (!isNaN(x = +x)) return range[d3.bisect(thresholds, x)];
    }
    scale.domain = function(x) {
      if (!arguments.length) return domain;
      domain = x.map(d3_number).filter(d3_numeric).sort(d3_ascending);
      return rescale();
    };
    scale.range = function(x) {
      if (!arguments.length) return range;
      range = x;
      return rescale();
    };
    scale.quantiles = function() {
      return thresholds;
    };
    scale.invertExtent = function(y) {
      y = range.indexOf(y);
      return y < 0 ? [ NaN, NaN ] : [ y > 0 ? thresholds[y - 1] : domain[0], y < thresholds.length ? thresholds[y] : domain[domain.length - 1] ];
    };
    scale.copy = function() {
      return d3_scale_quantile(domain, range);
    };
    return rescale();
  }
  d3.scale.quantize = function() {
    return d3_scale_quantize(0, 1, [ 0, 1 ]);
  };
  function d3_scale_quantize(x0, x1, range) {
    var kx, i;
    function scale(x) {
      return range[Math.max(0, Math.min(i, Math.floor(kx * (x - x0))))];
    }
    function rescale() {
      kx = range.length / (x1 - x0);
      i = range.length - 1;
      return scale;
    }
    scale.domain = function(x) {
      if (!arguments.length) return [ x0, x1 ];
      x0 = +x[0];
      x1 = +x[x.length - 1];
      return rescale();
    };
    scale.range = function(x) {
      if (!arguments.length) return range;
      range = x;
      return rescale();
    };
    scale.invertExtent = function(y) {
      y = range.indexOf(y);
      y = y < 0 ? NaN : y / kx + x0;
      return [ y, y + 1 / kx ];
    };
    scale.copy = function() {
      return d3_scale_quantize(x0, x1, range);
    };
    return rescale();
  }
  d3.scale.threshold = function() {
    return d3_scale_threshold([ .5 ], [ 0, 1 ]);
  };
  function d3_scale_threshold(domain, range) {
    function scale(x) {
      if (x <= x) return range[d3.bisect(domain, x)];
    }
    scale.domain = function(_) {
      if (!arguments.length) return domain;
      domain = _;
      return scale;
    };
    scale.range = function(_) {
      if (!arguments.length) return range;
      range = _;
      return scale;
    };
    scale.invertExtent = function(y) {
      y = range.indexOf(y);
      return [ domain[y - 1], domain[y] ];
    };
    scale.copy = function() {
      return d3_scale_threshold(domain, range);
    };
    return scale;
  }
  d3.scale.identity = function() {
    return d3_scale_identity([ 0, 1 ]);
  };
  function d3_scale_identity(domain) {
    function identity(x) {
      return +x;
    }
    identity.invert = identity;
    identity.domain = identity.range = function(x) {
      if (!arguments.length) return domain;
      domain = x.map(identity);
      return identity;
    };
    identity.ticks = function(m) {
      return d3_scale_linearTicks(domain, m);
    };
    identity.tickFormat = function(m, format) {
      return d3_scale_linearTickFormat(domain, m, format);
    };
    identity.copy = function() {
      return d3_scale_identity(domain);
    };
    return identity;
  }
  d3.svg = {};
  function d3_zero() {
    return 0;
  }
  d3.svg.arc = function() {
    var innerRadius = d3_svg_arcInnerRadius, outerRadius = d3_svg_arcOuterRadius, cornerRadius = d3_zero, padRadius = d3_svg_arcAuto, startAngle = d3_svg_arcStartAngle, endAngle = d3_svg_arcEndAngle, padAngle = d3_svg_arcPadAngle;
    function arc() {
      var r0 = Math.max(0, +innerRadius.apply(this, arguments)), r1 = Math.max(0, +outerRadius.apply(this, arguments)), a0 = startAngle.apply(this, arguments) - halfπ, a1 = endAngle.apply(this, arguments) - halfπ, da = Math.abs(a1 - a0), cw = a0 > a1 ? 0 : 1;
      if (r1 < r0) rc = r1, r1 = r0, r0 = rc;
      if (da >= τε) return circleSegment(r1, cw) + (r0 ? circleSegment(r0, 1 - cw) : "") + "Z";
      var rc, cr, rp, ap, p0 = 0, p1 = 0, x0, y0, x1, y1, x2, y2, x3, y3, path = [];
      if (ap = (+padAngle.apply(this, arguments) || 0) / 2) {
        rp = padRadius === d3_svg_arcAuto ? Math.sqrt(r0 * r0 + r1 * r1) : +padRadius.apply(this, arguments);
        if (!cw) p1 *= -1;
        if (r1) p1 = d3_asin(rp / r1 * Math.sin(ap));
        if (r0) p0 = d3_asin(rp / r0 * Math.sin(ap));
      }
      if (r1) {
        x0 = r1 * Math.cos(a0 + p1);
        y0 = r1 * Math.sin(a0 + p1);
        x1 = r1 * Math.cos(a1 - p1);
        y1 = r1 * Math.sin(a1 - p1);
        var l1 = Math.abs(a1 - a0 - 2 * p1) <= π ? 0 : 1;
        if (p1 && d3_svg_arcSweep(x0, y0, x1, y1) === cw ^ l1) {
          var h1 = (a0 + a1) / 2;
          x0 = r1 * Math.cos(h1);
          y0 = r1 * Math.sin(h1);
          x1 = y1 = null;
        }
      } else {
        x0 = y0 = 0;
      }
      if (r0) {
        x2 = r0 * Math.cos(a1 - p0);
        y2 = r0 * Math.sin(a1 - p0);
        x3 = r0 * Math.cos(a0 + p0);
        y3 = r0 * Math.sin(a0 + p0);
        var l0 = Math.abs(a0 - a1 + 2 * p0) <= π ? 0 : 1;
        if (p0 && d3_svg_arcSweep(x2, y2, x3, y3) === 1 - cw ^ l0) {
          var h0 = (a0 + a1) / 2;
          x2 = r0 * Math.cos(h0);
          y2 = r0 * Math.sin(h0);
          x3 = y3 = null;
        }
      } else {
        x2 = y2 = 0;
      }
      if ((rc = Math.min(Math.abs(r1 - r0) / 2, +cornerRadius.apply(this, arguments))) > .001) {
        cr = r0 < r1 ^ cw ? 0 : 1;
        var oc = x3 == null ? [ x2, y2 ] : x1 == null ? [ x0, y0 ] : d3_geom_polygonIntersect([ x0, y0 ], [ x3, y3 ], [ x1, y1 ], [ x2, y2 ]), ax = x0 - oc[0], ay = y0 - oc[1], bx = x1 - oc[0], by = y1 - oc[1], kc = 1 / Math.sin(Math.acos((ax * bx + ay * by) / (Math.sqrt(ax * ax + ay * ay) * Math.sqrt(bx * bx + by * by))) / 2), lc = Math.sqrt(oc[0] * oc[0] + oc[1] * oc[1]);
        if (x1 != null) {
          var rc1 = Math.min(rc, (r1 - lc) / (kc + 1)), t30 = d3_svg_arcCornerTangents(x3 == null ? [ x2, y2 ] : [ x3, y3 ], [ x0, y0 ], r1, rc1, cw), t12 = d3_svg_arcCornerTangents([ x1, y1 ], [ x2, y2 ], r1, rc1, cw);
          if (rc === rc1) {
            path.push("M", t30[0], "A", rc1, ",", rc1, " 0 0,", cr, " ", t30[1], "A", r1, ",", r1, " 0 ", 1 - cw ^ d3_svg_arcSweep(t30[1][0], t30[1][1], t12[1][0], t12[1][1]), ",", cw, " ", t12[1], "A", rc1, ",", rc1, " 0 0,", cr, " ", t12[0]);
          } else {
            path.push("M", t30[0], "A", rc1, ",", rc1, " 0 1,", cr, " ", t12[0]);
          }
        } else {
          path.push("M", x0, ",", y0);
        }
        if (x3 != null) {
          var rc0 = Math.min(rc, (r0 - lc) / (kc - 1)), t03 = d3_svg_arcCornerTangents([ x0, y0 ], [ x3, y3 ], r0, -rc0, cw), t21 = d3_svg_arcCornerTangents([ x2, y2 ], x1 == null ? [ x0, y0 ] : [ x1, y1 ], r0, -rc0, cw);
          if (rc === rc0) {
            path.push("L", t21[0], "A", rc0, ",", rc0, " 0 0,", cr, " ", t21[1], "A", r0, ",", r0, " 0 ", cw ^ d3_svg_arcSweep(t21[1][0], t21[1][1], t03[1][0], t03[1][1]), ",", 1 - cw, " ", t03[1], "A", rc0, ",", rc0, " 0 0,", cr, " ", t03[0]);
          } else {
            path.push("L", t21[0], "A", rc0, ",", rc0, " 0 0,", cr, " ", t03[0]);
          }
        } else {
          path.push("L", x2, ",", y2);
        }
      } else {
        path.push("M", x0, ",", y0);
        if (x1 != null) path.push("A", r1, ",", r1, " 0 ", l1, ",", cw, " ", x1, ",", y1);
        path.push("L", x2, ",", y2);
        if (x3 != null) path.push("A", r0, ",", r0, " 0 ", l0, ",", 1 - cw, " ", x3, ",", y3);
      }
      path.push("Z");
      return path.join("");
    }
    function circleSegment(r1, cw) {
      return "M0," + r1 + "A" + r1 + "," + r1 + " 0 1," + cw + " 0," + -r1 + "A" + r1 + "," + r1 + " 0 1," + cw + " 0," + r1;
    }
    arc.innerRadius = function(v) {
      if (!arguments.length) return innerRadius;
      innerRadius = d3_functor(v);
      return arc;
    };
    arc.outerRadius = function(v) {
      if (!arguments.length) return outerRadius;
      outerRadius = d3_functor(v);
      return arc;
    };
    arc.cornerRadius = function(v) {
      if (!arguments.length) return cornerRadius;
      cornerRadius = d3_functor(v);
      return arc;
    };
    arc.padRadius = function(v) {
      if (!arguments.length) return padRadius;
      padRadius = v == d3_svg_arcAuto ? d3_svg_arcAuto : d3_functor(v);
      return arc;
    };
    arc.startAngle = function(v) {
      if (!arguments.length) return startAngle;
      startAngle = d3_functor(v);
      return arc;
    };
    arc.endAngle = function(v) {
      if (!arguments.length) return endAngle;
      endAngle = d3_functor(v);
      return arc;
    };
    arc.padAngle = function(v) {
      if (!arguments.length) return padAngle;
      padAngle = d3_functor(v);
      return arc;
    };
    arc.centroid = function() {
      var r = (+innerRadius.apply(this, arguments) + +outerRadius.apply(this, arguments)) / 2, a = (+startAngle.apply(this, arguments) + +endAngle.apply(this, arguments)) / 2 - halfπ;
      return [ Math.cos(a) * r, Math.sin(a) * r ];
    };
    return arc;
  };
  var d3_svg_arcAuto = "auto";
  function d3_svg_arcInnerRadius(d) {
    return d.innerRadius;
  }
  function d3_svg_arcOuterRadius(d) {
    return d.outerRadius;
  }
  function d3_svg_arcStartAngle(d) {
    return d.startAngle;
  }
  function d3_svg_arcEndAngle(d) {
    return d.endAngle;
  }
  function d3_svg_arcPadAngle(d) {
    return d && d.padAngle;
  }
  function d3_svg_arcSweep(x0, y0, x1, y1) {
    return (x0 - x1) * y0 - (y0 - y1) * x0 > 0 ? 0 : 1;
  }
  function d3_svg_arcCornerTangents(p0, p1, r1, rc, cw) {
    var x01 = p0[0] - p1[0], y01 = p0[1] - p1[1], lo = (cw ? rc : -rc) / Math.sqrt(x01 * x01 + y01 * y01), ox = lo * y01, oy = -lo * x01, x1 = p0[0] + ox, y1 = p0[1] + oy, x2 = p1[0] + ox, y2 = p1[1] + oy, x3 = (x1 + x2) / 2, y3 = (y1 + y2) / 2, dx = x2 - x1, dy = y2 - y1, d2 = dx * dx + dy * dy, r = r1 - rc, D = x1 * y2 - x2 * y1, d = (dy < 0 ? -1 : 1) * Math.sqrt(r * r * d2 - D * D), cx0 = (D * dy - dx * d) / d2, cy0 = (-D * dx - dy * d) / d2, cx1 = (D * dy + dx * d) / d2, cy1 = (-D * dx + dy * d) / d2, dx0 = cx0 - x3, dy0 = cy0 - y3, dx1 = cx1 - x3, dy1 = cy1 - y3;
    if (dx0 * dx0 + dy0 * dy0 > dx1 * dx1 + dy1 * dy1) cx0 = cx1, cy0 = cy1;
    return [ [ cx0 - ox, cy0 - oy ], [ cx0 * r1 / r, cy0 * r1 / r ] ];
  }
  function d3_svg_line(projection) {
    var x = d3_geom_pointX, y = d3_geom_pointY, defined = d3_true, interpolate = d3_svg_lineLinear, interpolateKey = interpolate.key, tension = .7;
    function line(data) {
      var segments = [], points = [], i = -1, n = data.length, d, fx = d3_functor(x), fy = d3_functor(y);
      function segment() {
        segments.push("M", interpolate(projection(points), tension));
      }
      while (++i < n) {
        if (defined.call(this, d = data[i], i)) {
          points.push([ +fx.call(this, d, i), +fy.call(this, d, i) ]);
        } else if (points.length) {
          segment();
          points = [];
        }
      }
      if (points.length) segment();
      return segments.length ? segments.join("") : null;
    }
    line.x = function(_) {
      if (!arguments.length) return x;
      x = _;
      return line;
    };
    line.y = function(_) {
      if (!arguments.length) return y;
      y = _;
      return line;
    };
    line.defined = function(_) {
      if (!arguments.length) return defined;
      defined = _;
      return line;
    };
    line.interpolate = function(_) {
      if (!arguments.length) return interpolateKey;
      if (typeof _ === "function") interpolateKey = interpolate = _; else interpolateKey = (interpolate = d3_svg_lineInterpolators.get(_) || d3_svg_lineLinear).key;
      return line;
    };
    line.tension = function(_) {
      if (!arguments.length) return tension;
      tension = _;
      return line;
    };
    return line;
  }
  d3.svg.line = function() {
    return d3_svg_line(d3_identity);
  };
  var d3_svg_lineInterpolators = d3.map({
    linear: d3_svg_lineLinear,
    "linear-closed": d3_svg_lineLinearClosed,
    step: d3_svg_lineStep,
    "step-before": d3_svg_lineStepBefore,
    "step-after": d3_svg_lineStepAfter,
    basis: d3_svg_lineBasis,
    "basis-open": d3_svg_lineBasisOpen,
    "basis-closed": d3_svg_lineBasisClosed,
    bundle: d3_svg_lineBundle,
    cardinal: d3_svg_lineCardinal,
    "cardinal-open": d3_svg_lineCardinalOpen,
    "cardinal-closed": d3_svg_lineCardinalClosed,
    monotone: d3_svg_lineMonotone
  });
  d3_svg_lineInterpolators.forEach(function(key, value) {
    value.key = key;
    value.closed = /-closed$/.test(key);
  });
  function d3_svg_lineLinear(points) {
    return points.join("L");
  }
  function d3_svg_lineLinearClosed(points) {
    return d3_svg_lineLinear(points) + "Z";
  }
  function d3_svg_lineStep(points) {
    var i = 0, n = points.length, p = points[0], path = [ p[0], ",", p[1] ];
    while (++i < n) path.push("H", (p[0] + (p = points[i])[0]) / 2, "V", p[1]);
    if (n > 1) path.push("H", p[0]);
    return path.join("");
  }
  function d3_svg_lineStepBefore(points) {
    var i = 0, n = points.length, p = points[0], path = [ p[0], ",", p[1] ];
    while (++i < n) path.push("V", (p = points[i])[1], "H", p[0]);
    return path.join("");
  }
  function d3_svg_lineStepAfter(points) {
    var i = 0, n = points.length, p = points[0], path = [ p[0], ",", p[1] ];
    while (++i < n) path.push("H", (p = points[i])[0], "V", p[1]);
    return path.join("");
  }
  function d3_svg_lineCardinalOpen(points, tension) {
    return points.length < 4 ? d3_svg_lineLinear(points) : points[1] + d3_svg_lineHermite(points.slice(1, -1), d3_svg_lineCardinalTangents(points, tension));
  }
  function d3_svg_lineCardinalClosed(points, tension) {
    return points.length < 3 ? d3_svg_lineLinear(points) : points[0] + d3_svg_lineHermite((points.push(points[0]), 
    points), d3_svg_lineCardinalTangents([ points[points.length - 2] ].concat(points, [ points[1] ]), tension));
  }
  function d3_svg_lineCardinal(points, tension) {
    return points.length < 3 ? d3_svg_lineLinear(points) : points[0] + d3_svg_lineHermite(points, d3_svg_lineCardinalTangents(points, tension));
  }
  function d3_svg_lineHermite(points, tangents) {
    if (tangents.length < 1 || points.length != tangents.length && points.length != tangents.length + 2) {
      return d3_svg_lineLinear(points);
    }
    var quad = points.length != tangents.length, path = "", p0 = points[0], p = points[1], t0 = tangents[0], t = t0, pi = 1;
    if (quad) {
      path += "Q" + (p[0] - t0[0] * 2 / 3) + "," + (p[1] - t0[1] * 2 / 3) + "," + p[0] + "," + p[1];
      p0 = points[1];
      pi = 2;
    }
    if (tangents.length > 1) {
      t = tangents[1];
      p = points[pi];
      pi++;
      path += "C" + (p0[0] + t0[0]) + "," + (p0[1] + t0[1]) + "," + (p[0] - t[0]) + "," + (p[1] - t[1]) + "," + p[0] + "," + p[1];
      for (var i = 2; i < tangents.length; i++, pi++) {
        p = points[pi];
        t = tangents[i];
        path += "S" + (p[0] - t[0]) + "," + (p[1] - t[1]) + "," + p[0] + "," + p[1];
      }
    }
    if (quad) {
      var lp = points[pi];
      path += "Q" + (p[0] + t[0] * 2 / 3) + "," + (p[1] + t[1] * 2 / 3) + "," + lp[0] + "," + lp[1];
    }
    return path;
  }
  function d3_svg_lineCardinalTangents(points, tension) {
    var tangents = [], a = (1 - tension) / 2, p0, p1 = points[0], p2 = points[1], i = 1, n = points.length;
    while (++i < n) {
      p0 = p1;
      p1 = p2;
      p2 = points[i];
      tangents.push([ a * (p2[0] - p0[0]), a * (p2[1] - p0[1]) ]);
    }
    return tangents;
  }
  function d3_svg_lineBasis(points) {
    if (points.length < 3) return d3_svg_lineLinear(points);
    var i = 1, n = points.length, pi = points[0], x0 = pi[0], y0 = pi[1], px = [ x0, x0, x0, (pi = points[1])[0] ], py = [ y0, y0, y0, pi[1] ], path = [ x0, ",", y0, "L", d3_svg_lineDot4(d3_svg_lineBasisBezier3, px), ",", d3_svg_lineDot4(d3_svg_lineBasisBezier3, py) ];
    points.push(points[n - 1]);
    while (++i <= n) {
      pi = points[i];
      px.shift();
      px.push(pi[0]);
      py.shift();
      py.push(pi[1]);
      d3_svg_lineBasisBezier(path, px, py);
    }
    points.pop();
    path.push("L", pi);
    return path.join("");
  }
  function d3_svg_lineBasisOpen(points) {
    if (points.length < 4) return d3_svg_lineLinear(points);
    var path = [], i = -1, n = points.length, pi, px = [ 0 ], py = [ 0 ];
    while (++i < 3) {
      pi = points[i];
      px.push(pi[0]);
      py.push(pi[1]);
    }
    path.push(d3_svg_lineDot4(d3_svg_lineBasisBezier3, px) + "," + d3_svg_lineDot4(d3_svg_lineBasisBezier3, py));
    --i;
    while (++i < n) {
      pi = points[i];
      px.shift();
      px.push(pi[0]);
      py.shift();
      py.push(pi[1]);
      d3_svg_lineBasisBezier(path, px, py);
    }
    return path.join("");
  }
  function d3_svg_lineBasisClosed(points) {
    var path, i = -1, n = points.length, m = n + 4, pi, px = [], py = [];
    while (++i < 4) {
      pi = points[i % n];
      px.push(pi[0]);
      py.push(pi[1]);
    }
    path = [ d3_svg_lineDot4(d3_svg_lineBasisBezier3, px), ",", d3_svg_lineDot4(d3_svg_lineBasisBezier3, py) ];
    --i;
    while (++i < m) {
      pi = points[i % n];
      px.shift();
      px.push(pi[0]);
      py.shift();
      py.push(pi[1]);
      d3_svg_lineBasisBezier(path, px, py);
    }
    return path.join("");
  }
  function d3_svg_lineBundle(points, tension) {
    var n = points.length - 1;
    if (n) {
      var x0 = points[0][0], y0 = points[0][1], dx = points[n][0] - x0, dy = points[n][1] - y0, i = -1, p, t;
      while (++i <= n) {
        p = points[i];
        t = i / n;
        p[0] = tension * p[0] + (1 - tension) * (x0 + t * dx);
        p[1] = tension * p[1] + (1 - tension) * (y0 + t * dy);
      }
    }
    return d3_svg_lineBasis(points);
  }
  function d3_svg_lineDot4(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
  }
  var d3_svg_lineBasisBezier1 = [ 0, 2 / 3, 1 / 3, 0 ], d3_svg_lineBasisBezier2 = [ 0, 1 / 3, 2 / 3, 0 ], d3_svg_lineBasisBezier3 = [ 0, 1 / 6, 2 / 3, 1 / 6 ];
  function d3_svg_lineBasisBezier(path, x, y) {
    path.push("C", d3_svg_lineDot4(d3_svg_lineBasisBezier1, x), ",", d3_svg_lineDot4(d3_svg_lineBasisBezier1, y), ",", d3_svg_lineDot4(d3_svg_lineBasisBezier2, x), ",", d3_svg_lineDot4(d3_svg_lineBasisBezier2, y), ",", d3_svg_lineDot4(d3_svg_lineBasisBezier3, x), ",", d3_svg_lineDot4(d3_svg_lineBasisBezier3, y));
  }
  function d3_svg_lineSlope(p0, p1) {
    return (p1[1] - p0[1]) / (p1[0] - p0[0]);
  }
  function d3_svg_lineFiniteDifferences(points) {
    var i = 0, j = points.length - 1, m = [], p0 = points[0], p1 = points[1], d = m[0] = d3_svg_lineSlope(p0, p1);
    while (++i < j) {
      m[i] = (d + (d = d3_svg_lineSlope(p0 = p1, p1 = points[i + 1]))) / 2;
    }
    m[i] = d;
    return m;
  }
  function d3_svg_lineMonotoneTangents(points) {
    var tangents = [], d, a, b, s, m = d3_svg_lineFiniteDifferences(points), i = -1, j = points.length - 1;
    while (++i < j) {
      d = d3_svg_lineSlope(points[i], points[i + 1]);
      if (abs(d) < ε) {
        m[i] = m[i + 1] = 0;
      } else {
        a = m[i] / d;
        b = m[i + 1] / d;
        s = a * a + b * b;
        if (s > 9) {
          s = d * 3 / Math.sqrt(s);
          m[i] = s * a;
          m[i + 1] = s * b;
        }
      }
    }
    i = -1;
    while (++i <= j) {
      s = (points[Math.min(j, i + 1)][0] - points[Math.max(0, i - 1)][0]) / (6 * (1 + m[i] * m[i]));
      tangents.push([ s || 0, m[i] * s || 0 ]);
    }
    return tangents;
  }
  function d3_svg_lineMonotone(points) {
    return points.length < 3 ? d3_svg_lineLinear(points) : points[0] + d3_svg_lineHermite(points, d3_svg_lineMonotoneTangents(points));
  }
  d3.svg.line.radial = function() {
    var line = d3_svg_line(d3_svg_lineRadial);
    line.radius = line.x, delete line.x;
    line.angle = line.y, delete line.y;
    return line;
  };
  function d3_svg_lineRadial(points) {
    var point, i = -1, n = points.length, r, a;
    while (++i < n) {
      point = points[i];
      r = point[0];
      a = point[1] - halfπ;
      point[0] = r * Math.cos(a);
      point[1] = r * Math.sin(a);
    }
    return points;
  }
  function d3_svg_area(projection) {
    var x0 = d3_geom_pointX, x1 = d3_geom_pointX, y0 = 0, y1 = d3_geom_pointY, defined = d3_true, interpolate = d3_svg_lineLinear, interpolateKey = interpolate.key, interpolateReverse = interpolate, L = "L", tension = .7;
    function area(data) {
      var segments = [], points0 = [], points1 = [], i = -1, n = data.length, d, fx0 = d3_functor(x0), fy0 = d3_functor(y0), fx1 = x0 === x1 ? function() {
        return x;
      } : d3_functor(x1), fy1 = y0 === y1 ? function() {
        return y;
      } : d3_functor(y1), x, y;
      function segment() {
        segments.push("M", interpolate(projection(points1), tension), L, interpolateReverse(projection(points0.reverse()), tension), "Z");
      }
      while (++i < n) {
        if (defined.call(this, d = data[i], i)) {
          points0.push([ x = +fx0.call(this, d, i), y = +fy0.call(this, d, i) ]);
          points1.push([ +fx1.call(this, d, i), +fy1.call(this, d, i) ]);
        } else if (points0.length) {
          segment();
          points0 = [];
          points1 = [];
        }
      }
      if (points0.length) segment();
      return segments.length ? segments.join("") : null;
    }
    area.x = function(_) {
      if (!arguments.length) return x1;
      x0 = x1 = _;
      return area;
    };
    area.x0 = function(_) {
      if (!arguments.length) return x0;
      x0 = _;
      return area;
    };
    area.x1 = function(_) {
      if (!arguments.length) return x1;
      x1 = _;
      return area;
    };
    area.y = function(_) {
      if (!arguments.length) return y1;
      y0 = y1 = _;
      return area;
    };
    area.y0 = function(_) {
      if (!arguments.length) return y0;
      y0 = _;
      return area;
    };
    area.y1 = function(_) {
      if (!arguments.length) return y1;
      y1 = _;
      return area;
    };
    area.defined = function(_) {
      if (!arguments.length) return defined;
      defined = _;
      return area;
    };
    area.interpolate = function(_) {
      if (!arguments.length) return interpolateKey;
      if (typeof _ === "function") interpolateKey = interpolate = _; else interpolateKey = (interpolate = d3_svg_lineInterpolators.get(_) || d3_svg_lineLinear).key;
      interpolateReverse = interpolate.reverse || interpolate;
      L = interpolate.closed ? "M" : "L";
      return area;
    };
    area.tension = function(_) {
      if (!arguments.length) return tension;
      tension = _;
      return area;
    };
    return area;
  }
  d3_svg_lineStepBefore.reverse = d3_svg_lineStepAfter;
  d3_svg_lineStepAfter.reverse = d3_svg_lineStepBefore;
  d3.svg.area = function() {
    return d3_svg_area(d3_identity);
  };
  d3.svg.area.radial = function() {
    var area = d3_svg_area(d3_svg_lineRadial);
    area.radius = area.x, delete area.x;
    area.innerRadius = area.x0, delete area.x0;
    area.outerRadius = area.x1, delete area.x1;
    area.angle = area.y, delete area.y;
    area.startAngle = area.y0, delete area.y0;
    area.endAngle = area.y1, delete area.y1;
    return area;
  };
  d3.svg.chord = function() {
    var source = d3_source, target = d3_target, radius = d3_svg_chordRadius, startAngle = d3_svg_arcStartAngle, endAngle = d3_svg_arcEndAngle;
    function chord(d, i) {
      var s = subgroup(this, source, d, i), t = subgroup(this, target, d, i);
      return "M" + s.p0 + arc(s.r, s.p1, s.a1 - s.a0) + (equals(s, t) ? curve(s.r, s.p1, s.r, s.p0) : curve(s.r, s.p1, t.r, t.p0) + arc(t.r, t.p1, t.a1 - t.a0) + curve(t.r, t.p1, s.r, s.p0)) + "Z";
    }
    function subgroup(self, f, d, i) {
      var subgroup = f.call(self, d, i), r = radius.call(self, subgroup, i), a0 = startAngle.call(self, subgroup, i) - halfπ, a1 = endAngle.call(self, subgroup, i) - halfπ;
      return {
        r: r,
        a0: a0,
        a1: a1,
        p0: [ r * Math.cos(a0), r * Math.sin(a0) ],
        p1: [ r * Math.cos(a1), r * Math.sin(a1) ]
      };
    }
    function equals(a, b) {
      return a.a0 == b.a0 && a.a1 == b.a1;
    }
    function arc(r, p, a) {
      return "A" + r + "," + r + " 0 " + +(a > π) + ",1 " + p;
    }
    function curve(r0, p0, r1, p1) {
      return "Q 0,0 " + p1;
    }
    chord.radius = function(v) {
      if (!arguments.length) return radius;
      radius = d3_functor(v);
      return chord;
    };
    chord.source = function(v) {
      if (!arguments.length) return source;
      source = d3_functor(v);
      return chord;
    };
    chord.target = function(v) {
      if (!arguments.length) return target;
      target = d3_functor(v);
      return chord;
    };
    chord.startAngle = function(v) {
      if (!arguments.length) return startAngle;
      startAngle = d3_functor(v);
      return chord;
    };
    chord.endAngle = function(v) {
      if (!arguments.length) return endAngle;
      endAngle = d3_functor(v);
      return chord;
    };
    return chord;
  };
  function d3_svg_chordRadius(d) {
    return d.radius;
  }
  d3.svg.diagonal = function() {
    var source = d3_source, target = d3_target, projection = d3_svg_diagonalProjection;
    function diagonal(d, i) {
      var p0 = source.call(this, d, i), p3 = target.call(this, d, i), m = (p0.y + p3.y) / 2, p = [ p0, {
        x: p0.x,
        y: m
      }, {
        x: p3.x,
        y: m
      }, p3 ];
      p = p.map(projection);
      return "M" + p[0] + "C" + p[1] + " " + p[2] + " " + p[3];
    }
    diagonal.source = function(x) {
      if (!arguments.length) return source;
      source = d3_functor(x);
      return diagonal;
    };
    diagonal.target = function(x) {
      if (!arguments.length) return target;
      target = d3_functor(x);
      return diagonal;
    };
    diagonal.projection = function(x) {
      if (!arguments.length) return projection;
      projection = x;
      return diagonal;
    };
    return diagonal;
  };
  function d3_svg_diagonalProjection(d) {
    return [ d.x, d.y ];
  }
  d3.svg.diagonal.radial = function() {
    var diagonal = d3.svg.diagonal(), projection = d3_svg_diagonalProjection, projection_ = diagonal.projection;
    diagonal.projection = function(x) {
      return arguments.length ? projection_(d3_svg_diagonalRadialProjection(projection = x)) : projection;
    };
    return diagonal;
  };
  function d3_svg_diagonalRadialProjection(projection) {
    return function() {
      var d = projection.apply(this, arguments), r = d[0], a = d[1] - halfπ;
      return [ r * Math.cos(a), r * Math.sin(a) ];
    };
  }
  d3.svg.symbol = function() {
    var type = d3_svg_symbolType, size = d3_svg_symbolSize;
    function symbol(d, i) {
      return (d3_svg_symbols.get(type.call(this, d, i)) || d3_svg_symbolCircle)(size.call(this, d, i));
    }
    symbol.type = function(x) {
      if (!arguments.length) return type;
      type = d3_functor(x);
      return symbol;
    };
    symbol.size = function(x) {
      if (!arguments.length) return size;
      size = d3_functor(x);
      return symbol;
    };
    return symbol;
  };
  function d3_svg_symbolSize() {
    return 64;
  }
  function d3_svg_symbolType() {
    return "circle";
  }
  function d3_svg_symbolCircle(size) {
    var r = Math.sqrt(size / π);
    return "M0," + r + "A" + r + "," + r + " 0 1,1 0," + -r + "A" + r + "," + r + " 0 1,1 0," + r + "Z";
  }
  var d3_svg_symbols = d3.map({
    circle: d3_svg_symbolCircle,
    cross: function(size) {
      var r = Math.sqrt(size / 5) / 2;
      return "M" + -3 * r + "," + -r + "H" + -r + "V" + -3 * r + "H" + r + "V" + -r + "H" + 3 * r + "V" + r + "H" + r + "V" + 3 * r + "H" + -r + "V" + r + "H" + -3 * r + "Z";
    },
    diamond: function(size) {
      var ry = Math.sqrt(size / (2 * d3_svg_symbolTan30)), rx = ry * d3_svg_symbolTan30;
      return "M0," + -ry + "L" + rx + ",0" + " 0," + ry + " " + -rx + ",0" + "Z";
    },
    square: function(size) {
      var r = Math.sqrt(size) / 2;
      return "M" + -r + "," + -r + "L" + r + "," + -r + " " + r + "," + r + " " + -r + "," + r + "Z";
    },
    "triangle-down": function(size) {
      var rx = Math.sqrt(size / d3_svg_symbolSqrt3), ry = rx * d3_svg_symbolSqrt3 / 2;
      return "M0," + ry + "L" + rx + "," + -ry + " " + -rx + "," + -ry + "Z";
    },
    "triangle-up": function(size) {
      var rx = Math.sqrt(size / d3_svg_symbolSqrt3), ry = rx * d3_svg_symbolSqrt3 / 2;
      return "M0," + -ry + "L" + rx + "," + ry + " " + -rx + "," + ry + "Z";
    }
  });
  d3.svg.symbolTypes = d3_svg_symbols.keys();
  var d3_svg_symbolSqrt3 = Math.sqrt(3), d3_svg_symbolTan30 = Math.tan(30 * d3_radians);
  d3_selectionPrototype.transition = function(name) {
    var id = d3_transitionInheritId || ++d3_transitionId, ns = d3_transitionNamespace(name), subgroups = [], subgroup, node, transition = d3_transitionInherit || {
      time: Date.now(),
      ease: d3_ease_cubicInOut,
      delay: 0,
      duration: 250
    };
    for (var j = -1, m = this.length; ++j < m; ) {
      subgroups.push(subgroup = []);
      for (var group = this[j], i = -1, n = group.length; ++i < n; ) {
        if (node = group[i]) d3_transitionNode(node, i, ns, id, transition);
        subgroup.push(node);
      }
    }
    return d3_transition(subgroups, ns, id);
  };
  d3_selectionPrototype.interrupt = function(name) {
    return this.each(name == null ? d3_selection_interrupt : d3_selection_interruptNS(d3_transitionNamespace(name)));
  };
  var d3_selection_interrupt = d3_selection_interruptNS(d3_transitionNamespace());
  function d3_selection_interruptNS(ns) {
    return function() {
      var lock, active;
      if ((lock = this[ns]) && (active = lock[lock.active])) {
        if (--lock.count) delete lock[lock.active]; else delete this[ns];
        lock.active += .5;
        active.event && active.event.interrupt.call(this, this.__data__, active.index);
      }
    };
  }
  function d3_transition(groups, ns, id) {
    d3_subclass(groups, d3_transitionPrototype);
    groups.namespace = ns;
    groups.id = id;
    return groups;
  }
  var d3_transitionPrototype = [], d3_transitionId = 0, d3_transitionInheritId, d3_transitionInherit;
  d3_transitionPrototype.call = d3_selectionPrototype.call;
  d3_transitionPrototype.empty = d3_selectionPrototype.empty;
  d3_transitionPrototype.node = d3_selectionPrototype.node;
  d3_transitionPrototype.size = d3_selectionPrototype.size;
  d3.transition = function(selection, name) {
    return selection && selection.transition ? d3_transitionInheritId ? selection.transition(name) : selection : d3_selectionRoot.transition(selection);
  };
  d3.transition.prototype = d3_transitionPrototype;
  d3_transitionPrototype.select = function(selector) {
    var id = this.id, ns = this.namespace, subgroups = [], subgroup, subnode, node;
    selector = d3_selection_selector(selector);
    for (var j = -1, m = this.length; ++j < m; ) {
      subgroups.push(subgroup = []);
      for (var group = this[j], i = -1, n = group.length; ++i < n; ) {
        if ((node = group[i]) && (subnode = selector.call(node, node.__data__, i, j))) {
          if ("__data__" in node) subnode.__data__ = node.__data__;
          d3_transitionNode(subnode, i, ns, id, node[ns][id]);
          subgroup.push(subnode);
        } else {
          subgroup.push(null);
        }
      }
    }
    return d3_transition(subgroups, ns, id);
  };
  d3_transitionPrototype.selectAll = function(selector) {
    var id = this.id, ns = this.namespace, subgroups = [], subgroup, subnodes, node, subnode, transition;
    selector = d3_selection_selectorAll(selector);
    for (var j = -1, m = this.length; ++j < m; ) {
      for (var group = this[j], i = -1, n = group.length; ++i < n; ) {
        if (node = group[i]) {
          transition = node[ns][id];
          subnodes = selector.call(node, node.__data__, i, j);
          subgroups.push(subgroup = []);
          for (var k = -1, o = subnodes.length; ++k < o; ) {
            if (subnode = subnodes[k]) d3_transitionNode(subnode, k, ns, id, transition);
            subgroup.push(subnode);
          }
        }
      }
    }
    return d3_transition(subgroups, ns, id);
  };
  d3_transitionPrototype.filter = function(filter) {
    var subgroups = [], subgroup, group, node;
    if (typeof filter !== "function") filter = d3_selection_filter(filter);
    for (var j = 0, m = this.length; j < m; j++) {
      subgroups.push(subgroup = []);
      for (var group = this[j], i = 0, n = group.length; i < n; i++) {
        if ((node = group[i]) && filter.call(node, node.__data__, i, j)) {
          subgroup.push(node);
        }
      }
    }
    return d3_transition(subgroups, this.namespace, this.id);
  };
  d3_transitionPrototype.tween = function(name, tween) {
    var id = this.id, ns = this.namespace;
    if (arguments.length < 2) return this.node()[ns][id].tween.get(name);
    return d3_selection_each(this, tween == null ? function(node) {
      node[ns][id].tween.remove(name);
    } : function(node) {
      node[ns][id].tween.set(name, tween);
    });
  };
  function d3_transition_tween(groups, name, value, tween) {
    var id = groups.id, ns = groups.namespace;
    return d3_selection_each(groups, typeof value === "function" ? function(node, i, j) {
      node[ns][id].tween.set(name, tween(value.call(node, node.__data__, i, j)));
    } : (value = tween(value), function(node) {
      node[ns][id].tween.set(name, value);
    }));
  }
  d3_transitionPrototype.attr = function(nameNS, value) {
    if (arguments.length < 2) {
      for (value in nameNS) this.attr(value, nameNS[value]);
      return this;
    }
    var interpolate = nameNS == "transform" ? d3_interpolateTransform : d3_interpolate, name = d3.ns.qualify(nameNS);
    function attrNull() {
      this.removeAttribute(name);
    }
    function attrNullNS() {
      this.removeAttributeNS(name.space, name.local);
    }
    function attrTween(b) {
      return b == null ? attrNull : (b += "", function() {
        var a = this.getAttribute(name), i;
        return a !== b && (i = interpolate(a, b), function(t) {
          this.setAttribute(name, i(t));
        });
      });
    }
    function attrTweenNS(b) {
      return b == null ? attrNullNS : (b += "", function() {
        var a = this.getAttributeNS(name.space, name.local), i;
        return a !== b && (i = interpolate(a, b), function(t) {
          this.setAttributeNS(name.space, name.local, i(t));
        });
      });
    }
    return d3_transition_tween(this, "attr." + nameNS, value, name.local ? attrTweenNS : attrTween);
  };
  d3_transitionPrototype.attrTween = function(nameNS, tween) {
    var name = d3.ns.qualify(nameNS);
    function attrTween(d, i) {
      var f = tween.call(this, d, i, this.getAttribute(name));
      return f && function(t) {
        this.setAttribute(name, f(t));
      };
    }
    function attrTweenNS(d, i) {
      var f = tween.call(this, d, i, this.getAttributeNS(name.space, name.local));
      return f && function(t) {
        this.setAttributeNS(name.space, name.local, f(t));
      };
    }
    return this.tween("attr." + nameNS, name.local ? attrTweenNS : attrTween);
  };
  d3_transitionPrototype.style = function(name, value, priority) {
    var n = arguments.length;
    if (n < 3) {
      if (typeof name !== "string") {
        if (n < 2) value = "";
        for (priority in name) this.style(priority, name[priority], value);
        return this;
      }
      priority = "";
    }
    function styleNull() {
      this.style.removeProperty(name);
    }
    function styleString(b) {
      return b == null ? styleNull : (b += "", function() {
        var a = d3_window.getComputedStyle(this, null).getPropertyValue(name), i;
        return a !== b && (i = d3_interpolate(a, b), function(t) {
          this.style.setProperty(name, i(t), priority);
        });
      });
    }
    return d3_transition_tween(this, "style." + name, value, styleString);
  };
  d3_transitionPrototype.styleTween = function(name, tween, priority) {
    if (arguments.length < 3) priority = "";
    function styleTween(d, i) {
      var f = tween.call(this, d, i, d3_window.getComputedStyle(this, null).getPropertyValue(name));
      return f && function(t) {
        this.style.setProperty(name, f(t), priority);
      };
    }
    return this.tween("style." + name, styleTween);
  };
  d3_transitionPrototype.text = function(value) {
    return d3_transition_tween(this, "text", value, d3_transition_text);
  };
  function d3_transition_text(b) {
    if (b == null) b = "";
    return function() {
      this.textContent = b;
    };
  }
  d3_transitionPrototype.remove = function() {
    var ns = this.namespace;
    return this.each("end.transition", function() {
      var p;
      if (this[ns].count < 2 && (p = this.parentNode)) p.removeChild(this);
    });
  };
  d3_transitionPrototype.ease = function(value) {
    var id = this.id, ns = this.namespace;
    if (arguments.length < 1) return this.node()[ns][id].ease;
    if (typeof value !== "function") value = d3.ease.apply(d3, arguments);
    return d3_selection_each(this, function(node) {
      node[ns][id].ease = value;
    });
  };
  d3_transitionPrototype.delay = function(value) {
    var id = this.id, ns = this.namespace;
    if (arguments.length < 1) return this.node()[ns][id].delay;
    return d3_selection_each(this, typeof value === "function" ? function(node, i, j) {
      node[ns][id].delay = +value.call(node, node.__data__, i, j);
    } : (value = +value, function(node) {
      node[ns][id].delay = value;
    }));
  };
  d3_transitionPrototype.duration = function(value) {
    var id = this.id, ns = this.namespace;
    if (arguments.length < 1) return this.node()[ns][id].duration;
    return d3_selection_each(this, typeof value === "function" ? function(node, i, j) {
      node[ns][id].duration = Math.max(1, value.call(node, node.__data__, i, j));
    } : (value = Math.max(1, value), function(node) {
      node[ns][id].duration = value;
    }));
  };
  d3_transitionPrototype.each = function(type, listener) {
    var id = this.id, ns = this.namespace;
    if (arguments.length < 2) {
      var inherit = d3_transitionInherit, inheritId = d3_transitionInheritId;
      try {
        d3_transitionInheritId = id;
        d3_selection_each(this, function(node, i, j) {
          d3_transitionInherit = node[ns][id];
          type.call(node, node.__data__, i, j);
        });
      } finally {
        d3_transitionInherit = inherit;
        d3_transitionInheritId = inheritId;
      }
    } else {
      d3_selection_each(this, function(node) {
        var transition = node[ns][id];
        (transition.event || (transition.event = d3.dispatch("start", "end", "interrupt"))).on(type, listener);
      });
    }
    return this;
  };
  d3_transitionPrototype.transition = function() {
    var id0 = this.id, id1 = ++d3_transitionId, ns = this.namespace, subgroups = [], subgroup, group, node, transition;
    for (var j = 0, m = this.length; j < m; j++) {
      subgroups.push(subgroup = []);
      for (var group = this[j], i = 0, n = group.length; i < n; i++) {
        if (node = group[i]) {
          transition = node[ns][id0];
          d3_transitionNode(node, i, ns, id1, {
            time: transition.time,
            ease: transition.ease,
            delay: transition.delay + transition.duration,
            duration: transition.duration
          });
        }
        subgroup.push(node);
      }
    }
    return d3_transition(subgroups, ns, id1);
  };
  function d3_transitionNamespace(name) {
    return name == null ? "__transition__" : "__transition_" + name + "__";
  }
  function d3_transitionNode(node, i, ns, id, inherit) {
    var lock = node[ns] || (node[ns] = {
      active: 0,
      count: 0
    }), transition = lock[id];
    if (!transition) {
      var time = inherit.time;
      transition = lock[id] = {
        tween: new d3_Map(),
        time: time,
        delay: inherit.delay,
        duration: inherit.duration,
        ease: inherit.ease,
        index: i
      };
      inherit = null;
      ++lock.count;
      d3.timer(function(elapsed) {
        var delay = transition.delay, duration, ease, timer = d3_timer_active, tweened = [];
        timer.t = delay + time;
        if (delay <= elapsed) return start(elapsed - delay);
        timer.c = start;
        function start(elapsed) {
          if (lock.active > id) return stop();
          var active = lock[lock.active];
          if (active) {
            --lock.count;
            delete lock[lock.active];
            active.event && active.event.interrupt.call(node, node.__data__, active.index);
          }
          lock.active = id;
          transition.event && transition.event.start.call(node, node.__data__, i);
          transition.tween.forEach(function(key, value) {
            if (value = value.call(node, node.__data__, i)) {
              tweened.push(value);
            }
          });
          ease = transition.ease;
          duration = transition.duration;
          d3.timer(function() {
            timer.c = tick(elapsed || 1) ? d3_true : tick;
            return 1;
          }, 0, time);
        }
        function tick(elapsed) {
          if (lock.active !== id) return 1;
          var t = elapsed / duration, e = ease(t), n = tweened.length;
          while (n > 0) {
            tweened[--n].call(node, e);
          }
          if (t >= 1) {
            transition.event && transition.event.end.call(node, node.__data__, i);
            return stop();
          }
        }
        function stop() {
          if (--lock.count) delete lock[id]; else delete node[ns];
          return 1;
        }
      }, 0, time);
    }
  }
  d3.svg.axis = function() {
    var scale = d3.scale.linear(), orient = d3_svg_axisDefaultOrient, innerTickSize = 6, outerTickSize = 6, tickPadding = 3, tickArguments_ = [ 10 ], tickValues = null, tickFormat_;
    function axis(g) {
      g.each(function() {
        var g = d3.select(this);
        var scale0 = this.__chart__ || scale, scale1 = this.__chart__ = scale.copy();
        var ticks = tickValues == null ? scale1.ticks ? scale1.ticks.apply(scale1, tickArguments_) : scale1.domain() : tickValues, tickFormat = tickFormat_ == null ? scale1.tickFormat ? scale1.tickFormat.apply(scale1, tickArguments_) : d3_identity : tickFormat_, tick = g.selectAll(".tick").data(ticks, scale1), tickEnter = tick.enter().insert("g", ".domain").attr("class", "tick").style("opacity", ε), tickExit = d3.transition(tick.exit()).style("opacity", ε).remove(), tickUpdate = d3.transition(tick.order()).style("opacity", 1), tickSpacing = Math.max(innerTickSize, 0) + tickPadding, tickTransform;
        var range = d3_scaleRange(scale1), path = g.selectAll(".domain").data([ 0 ]), pathUpdate = (path.enter().append("path").attr("class", "domain"), 
        d3.transition(path));
        tickEnter.append("line");
        tickEnter.append("text");
        var lineEnter = tickEnter.select("line"), lineUpdate = tickUpdate.select("line"), text = tick.select("text").text(tickFormat), textEnter = tickEnter.select("text"), textUpdate = tickUpdate.select("text"), sign = orient === "top" || orient === "left" ? -1 : 1, x1, x2, y1, y2;
        if (orient === "bottom" || orient === "top") {
          tickTransform = d3_svg_axisX, x1 = "x", y1 = "y", x2 = "x2", y2 = "y2";
          text.attr("dy", sign < 0 ? "0em" : ".71em").style("text-anchor", "middle");
          pathUpdate.attr("d", "M" + range[0] + "," + sign * outerTickSize + "V0H" + range[1] + "V" + sign * outerTickSize);
        } else {
          tickTransform = d3_svg_axisY, x1 = "y", y1 = "x", x2 = "y2", y2 = "x2";
          text.attr("dy", ".32em").style("text-anchor", sign < 0 ? "end" : "start");
          pathUpdate.attr("d", "M" + sign * outerTickSize + "," + range[0] + "H0V" + range[1] + "H" + sign * outerTickSize);
        }
        lineEnter.attr(y2, sign * innerTickSize);
        textEnter.attr(y1, sign * tickSpacing);
        lineUpdate.attr(x2, 0).attr(y2, sign * innerTickSize);
        textUpdate.attr(x1, 0).attr(y1, sign * tickSpacing);
        if (scale1.rangeBand) {
          var x = scale1, dx = x.rangeBand() / 2;
          scale0 = scale1 = function(d) {
            return x(d) + dx;
          };
        } else if (scale0.rangeBand) {
          scale0 = scale1;
        } else {
          tickExit.call(tickTransform, scale1, scale0);
        }
        tickEnter.call(tickTransform, scale0, scale1);
        tickUpdate.call(tickTransform, scale1, scale1);
      });
    }
    axis.scale = function(x) {
      if (!arguments.length) return scale;
      scale = x;
      return axis;
    };
    axis.orient = function(x) {
      if (!arguments.length) return orient;
      orient = x in d3_svg_axisOrients ? x + "" : d3_svg_axisDefaultOrient;
      return axis;
    };
    axis.ticks = function() {
      if (!arguments.length) return tickArguments_;
      tickArguments_ = arguments;
      return axis;
    };
    axis.tickValues = function(x) {
      if (!arguments.length) return tickValues;
      tickValues = x;
      return axis;
    };
    axis.tickFormat = function(x) {
      if (!arguments.length) return tickFormat_;
      tickFormat_ = x;
      return axis;
    };
    axis.tickSize = function(x) {
      var n = arguments.length;
      if (!n) return innerTickSize;
      innerTickSize = +x;
      outerTickSize = +arguments[n - 1];
      return axis;
    };
    axis.innerTickSize = function(x) {
      if (!arguments.length) return innerTickSize;
      innerTickSize = +x;
      return axis;
    };
    axis.outerTickSize = function(x) {
      if (!arguments.length) return outerTickSize;
      outerTickSize = +x;
      return axis;
    };
    axis.tickPadding = function(x) {
      if (!arguments.length) return tickPadding;
      tickPadding = +x;
      return axis;
    };
    axis.tickSubdivide = function() {
      return arguments.length && axis;
    };
    return axis;
  };
  var d3_svg_axisDefaultOrient = "bottom", d3_svg_axisOrients = {
    top: 1,
    right: 1,
    bottom: 1,
    left: 1
  };
  function d3_svg_axisX(selection, x0, x1) {
    selection.attr("transform", function(d) {
      var v0 = x0(d);
      return "translate(" + (isFinite(v0) ? v0 : x1(d)) + ",0)";
    });
  }
  function d3_svg_axisY(selection, y0, y1) {
    selection.attr("transform", function(d) {
      var v0 = y0(d);
      return "translate(0," + (isFinite(v0) ? v0 : y1(d)) + ")";
    });
  }
  d3.svg.brush = function() {
    var event = d3_eventDispatch(brush, "brushstart", "brush", "brushend"), x = null, y = null, xExtent = [ 0, 0 ], yExtent = [ 0, 0 ], xExtentDomain, yExtentDomain, xClamp = true, yClamp = true, resizes = d3_svg_brushResizes[0];
    function brush(g) {
      g.each(function() {
        var g = d3.select(this).style("pointer-events", "all").style("-webkit-tap-highlight-color", "rgba(0,0,0,0)").on("mousedown.brush", brushstart).on("touchstart.brush", brushstart);
        var background = g.selectAll(".background").data([ 0 ]);
        background.enter().append("rect").attr("class", "background").style("visibility", "hidden").style("cursor", "crosshair");
        g.selectAll(".extent").data([ 0 ]).enter().append("rect").attr("class", "extent").style("cursor", "move");
        var resize = g.selectAll(".resize").data(resizes, d3_identity);
        resize.exit().remove();
        resize.enter().append("g").attr("class", function(d) {
          return "resize " + d;
        }).style("cursor", function(d) {
          return d3_svg_brushCursor[d];
        }).append("rect").attr("x", function(d) {
          return /[ew]$/.test(d) ? -3 : null;
        }).attr("y", function(d) {
          return /^[ns]/.test(d) ? -3 : null;
        }).attr("width", 6).attr("height", 6).style("visibility", "hidden");
        resize.style("display", brush.empty() ? "none" : null);
        var gUpdate = d3.transition(g), backgroundUpdate = d3.transition(background), range;
        if (x) {
          range = d3_scaleRange(x);
          backgroundUpdate.attr("x", range[0]).attr("width", range[1] - range[0]);
          redrawX(gUpdate);
        }
        if (y) {
          range = d3_scaleRange(y);
          backgroundUpdate.attr("y", range[0]).attr("height", range[1] - range[0]);
          redrawY(gUpdate);
        }
        redraw(gUpdate);
      });
    }
    brush.event = function(g) {
      g.each(function() {
        var event_ = event.of(this, arguments), extent1 = {
          x: xExtent,
          y: yExtent,
          i: xExtentDomain,
          j: yExtentDomain
        }, extent0 = this.__chart__ || extent1;
        this.__chart__ = extent1;
        if (d3_transitionInheritId) {
          d3.select(this).transition().each("start.brush", function() {
            xExtentDomain = extent0.i;
            yExtentDomain = extent0.j;
            xExtent = extent0.x;
            yExtent = extent0.y;
            event_({
              type: "brushstart"
            });
          }).tween("brush:brush", function() {
            var xi = d3_interpolateArray(xExtent, extent1.x), yi = d3_interpolateArray(yExtent, extent1.y);
            xExtentDomain = yExtentDomain = null;
            return function(t) {
              xExtent = extent1.x = xi(t);
              yExtent = extent1.y = yi(t);
              event_({
                type: "brush",
                mode: "resize"
              });
            };
          }).each("end.brush", function() {
            xExtentDomain = extent1.i;
            yExtentDomain = extent1.j;
            event_({
              type: "brush",
              mode: "resize"
            });
            event_({
              type: "brushend"
            });
          });
        } else {
          event_({
            type: "brushstart"
          });
          event_({
            type: "brush",
            mode: "resize"
          });
          event_({
            type: "brushend"
          });
        }
      });
    };
    function redraw(g) {
      g.selectAll(".resize").attr("transform", function(d) {
        return "translate(" + xExtent[+/e$/.test(d)] + "," + yExtent[+/^s/.test(d)] + ")";
      });
    }
    function redrawX(g) {
      g.select(".extent").attr("x", xExtent[0]);
      g.selectAll(".extent,.n>rect,.s>rect").attr("width", xExtent[1] - xExtent[0]);
    }
    function redrawY(g) {
      g.select(".extent").attr("y", yExtent[0]);
      g.selectAll(".extent,.e>rect,.w>rect").attr("height", yExtent[1] - yExtent[0]);
    }
    function brushstart() {
      var target = this, eventTarget = d3.select(d3.event.target), event_ = event.of(target, arguments), g = d3.select(target), resizing = eventTarget.datum(), resizingX = !/^(n|s)$/.test(resizing) && x, resizingY = !/^(e|w)$/.test(resizing) && y, dragging = eventTarget.classed("extent"), dragRestore = d3_event_dragSuppress(), center, origin = d3.mouse(target), offset;
      var w = d3.select(d3_window).on("keydown.brush", keydown).on("keyup.brush", keyup);
      if (d3.event.changedTouches) {
        w.on("touchmove.brush", brushmove).on("touchend.brush", brushend);
      } else {
        w.on("mousemove.brush", brushmove).on("mouseup.brush", brushend);
      }
      g.interrupt().selectAll("*").interrupt();
      if (dragging) {
        origin[0] = xExtent[0] - origin[0];
        origin[1] = yExtent[0] - origin[1];
      } else if (resizing) {
        var ex = +/w$/.test(resizing), ey = +/^n/.test(resizing);
        offset = [ xExtent[1 - ex] - origin[0], yExtent[1 - ey] - origin[1] ];
        origin[0] = xExtent[ex];
        origin[1] = yExtent[ey];
      } else if (d3.event.altKey) center = origin.slice();
      g.style("pointer-events", "none").selectAll(".resize").style("display", null);
      d3.select("body").style("cursor", eventTarget.style("cursor"));
      event_({
        type: "brushstart"
      });
      brushmove();
      function keydown() {
        if (d3.event.keyCode == 32) {
          if (!dragging) {
            center = null;
            origin[0] -= xExtent[1];
            origin[1] -= yExtent[1];
            dragging = 2;
          }
          d3_eventPreventDefault();
        }
      }
      function keyup() {
        if (d3.event.keyCode == 32 && dragging == 2) {
          origin[0] += xExtent[1];
          origin[1] += yExtent[1];
          dragging = 0;
          d3_eventPreventDefault();
        }
      }
      function brushmove() {
        var point = d3.mouse(target), moved = false;
        if (offset) {
          point[0] += offset[0];
          point[1] += offset[1];
        }
        if (!dragging) {
          if (d3.event.altKey) {
            if (!center) center = [ (xExtent[0] + xExtent[1]) / 2, (yExtent[0] + yExtent[1]) / 2 ];
            origin[0] = xExtent[+(point[0] < center[0])];
            origin[1] = yExtent[+(point[1] < center[1])];
          } else center = null;
        }
        if (resizingX && move1(point, x, 0)) {
          redrawX(g);
          moved = true;
        }
        if (resizingY && move1(point, y, 1)) {
          redrawY(g);
          moved = true;
        }
        if (moved) {
          redraw(g);
          event_({
            type: "brush",
            mode: dragging ? "move" : "resize"
          });
        }
      }
      function move1(point, scale, i) {
        var range = d3_scaleRange(scale), r0 = range[0], r1 = range[1], position = origin[i], extent = i ? yExtent : xExtent, size = extent[1] - extent[0], min, max;
        if (dragging) {
          r0 -= position;
          r1 -= size + position;
        }
        min = (i ? yClamp : xClamp) ? Math.max(r0, Math.min(r1, point[i])) : point[i];
        if (dragging) {
          max = (min += position) + size;
        } else {
          if (center) position = Math.max(r0, Math.min(r1, 2 * center[i] - min));
          if (position < min) {
            max = min;
            min = position;
          } else {
            max = position;
          }
        }
        if (extent[0] != min || extent[1] != max) {
          if (i) yExtentDomain = null; else xExtentDomain = null;
          extent[0] = min;
          extent[1] = max;
          return true;
        }
      }
      function brushend() {
        brushmove();
        g.style("pointer-events", "all").selectAll(".resize").style("display", brush.empty() ? "none" : null);
        d3.select("body").style("cursor", null);
        w.on("mousemove.brush", null).on("mouseup.brush", null).on("touchmove.brush", null).on("touchend.brush", null).on("keydown.brush", null).on("keyup.brush", null);
        dragRestore();
        event_({
          type: "brushend"
        });
      }
    }
    brush.x = function(z) {
      if (!arguments.length) return x;
      x = z;
      resizes = d3_svg_brushResizes[!x << 1 | !y];
      return brush;
    };
    brush.y = function(z) {
      if (!arguments.length) return y;
      y = z;
      resizes = d3_svg_brushResizes[!x << 1 | !y];
      return brush;
    };
    brush.clamp = function(z) {
      if (!arguments.length) return x && y ? [ xClamp, yClamp ] : x ? xClamp : y ? yClamp : null;
      if (x && y) xClamp = !!z[0], yClamp = !!z[1]; else if (x) xClamp = !!z; else if (y) yClamp = !!z;
      return brush;
    };
    brush.extent = function(z) {
      var x0, x1, y0, y1, t;
      if (!arguments.length) {
        if (x) {
          if (xExtentDomain) {
            x0 = xExtentDomain[0], x1 = xExtentDomain[1];
          } else {
            x0 = xExtent[0], x1 = xExtent[1];
            if (x.invert) x0 = x.invert(x0), x1 = x.invert(x1);
            if (x1 < x0) t = x0, x0 = x1, x1 = t;
          }
        }
        if (y) {
          if (yExtentDomain) {
            y0 = yExtentDomain[0], y1 = yExtentDomain[1];
          } else {
            y0 = yExtent[0], y1 = yExtent[1];
            if (y.invert) y0 = y.invert(y0), y1 = y.invert(y1);
            if (y1 < y0) t = y0, y0 = y1, y1 = t;
          }
        }
        return x && y ? [ [ x0, y0 ], [ x1, y1 ] ] : x ? [ x0, x1 ] : y && [ y0, y1 ];
      }
      if (x) {
        x0 = z[0], x1 = z[1];
        if (y) x0 = x0[0], x1 = x1[0];
        xExtentDomain = [ x0, x1 ];
        if (x.invert) x0 = x(x0), x1 = x(x1);
        if (x1 < x0) t = x0, x0 = x1, x1 = t;
        if (x0 != xExtent[0] || x1 != xExtent[1]) xExtent = [ x0, x1 ];
      }
      if (y) {
        y0 = z[0], y1 = z[1];
        if (x) y0 = y0[1], y1 = y1[1];
        yExtentDomain = [ y0, y1 ];
        if (y.invert) y0 = y(y0), y1 = y(y1);
        if (y1 < y0) t = y0, y0 = y1, y1 = t;
        if (y0 != yExtent[0] || y1 != yExtent[1]) yExtent = [ y0, y1 ];
      }
      return brush;
    };
    brush.clear = function() {
      if (!brush.empty()) {
        xExtent = [ 0, 0 ], yExtent = [ 0, 0 ];
        xExtentDomain = yExtentDomain = null;
      }
      return brush;
    };
    brush.empty = function() {
      return !!x && xExtent[0] == xExtent[1] || !!y && yExtent[0] == yExtent[1];
    };
    return d3.rebind(brush, event, "on");
  };
  var d3_svg_brushCursor = {
    n: "ns-resize",
    e: "ew-resize",
    s: "ns-resize",
    w: "ew-resize",
    nw: "nwse-resize",
    ne: "nesw-resize",
    se: "nwse-resize",
    sw: "nesw-resize"
  };
  var d3_svg_brushResizes = [ [ "n", "e", "s", "w", "nw", "ne", "se", "sw" ], [ "e", "w" ], [ "n", "s" ], [] ];
  var d3_time_format = d3_time.format = d3_locale_enUS.timeFormat;
  var d3_time_formatUtc = d3_time_format.utc;
  var d3_time_formatIso = d3_time_formatUtc("%Y-%m-%dT%H:%M:%S.%LZ");
  d3_time_format.iso = Date.prototype.toISOString && +new Date("2000-01-01T00:00:00.000Z") ? d3_time_formatIsoNative : d3_time_formatIso;
  function d3_time_formatIsoNative(date) {
    return date.toISOString();
  }
  d3_time_formatIsoNative.parse = function(string) {
    var date = new Date(string);
    return isNaN(date) ? null : date;
  };
  d3_time_formatIsoNative.toString = d3_time_formatIso.toString;
  d3_time.second = d3_time_interval(function(date) {
    return new d3_date(Math.floor(date / 1e3) * 1e3);
  }, function(date, offset) {
    date.setTime(date.getTime() + Math.floor(offset) * 1e3);
  }, function(date) {
    return date.getSeconds();
  });
  d3_time.seconds = d3_time.second.range;
  d3_time.seconds.utc = d3_time.second.utc.range;
  d3_time.minute = d3_time_interval(function(date) {
    return new d3_date(Math.floor(date / 6e4) * 6e4);
  }, function(date, offset) {
    date.setTime(date.getTime() + Math.floor(offset) * 6e4);
  }, function(date) {
    return date.getMinutes();
  });
  d3_time.minutes = d3_time.minute.range;
  d3_time.minutes.utc = d3_time.minute.utc.range;
  d3_time.hour = d3_time_interval(function(date) {
    var timezone = date.getTimezoneOffset() / 60;
    return new d3_date((Math.floor(date / 36e5 - timezone) + timezone) * 36e5);
  }, function(date, offset) {
    date.setTime(date.getTime() + Math.floor(offset) * 36e5);
  }, function(date) {
    return date.getHours();
  });
  d3_time.hours = d3_time.hour.range;
  d3_time.hours.utc = d3_time.hour.utc.range;
  d3_time.month = d3_time_interval(function(date) {
    date = d3_time.day(date);
    date.setDate(1);
    return date;
  }, function(date, offset) {
    date.setMonth(date.getMonth() + offset);
  }, function(date) {
    return date.getMonth();
  });
  d3_time.months = d3_time.month.range;
  d3_time.months.utc = d3_time.month.utc.range;
  function d3_time_scale(linear, methods, format) {
    function scale(x) {
      return linear(x);
    }
    scale.invert = function(x) {
      return d3_time_scaleDate(linear.invert(x));
    };
    scale.domain = function(x) {
      if (!arguments.length) return linear.domain().map(d3_time_scaleDate);
      linear.domain(x);
      return scale;
    };
    function tickMethod(extent, count) {
      var span = extent[1] - extent[0], target = span / count, i = d3.bisect(d3_time_scaleSteps, target);
      return i == d3_time_scaleSteps.length ? [ methods.year, d3_scale_linearTickRange(extent.map(function(d) {
        return d / 31536e6;
      }), count)[2] ] : !i ? [ d3_time_scaleMilliseconds, d3_scale_linearTickRange(extent, count)[2] ] : methods[target / d3_time_scaleSteps[i - 1] < d3_time_scaleSteps[i] / target ? i - 1 : i];
    }
    scale.nice = function(interval, skip) {
      var domain = scale.domain(), extent = d3_scaleExtent(domain), method = interval == null ? tickMethod(extent, 10) : typeof interval === "number" && tickMethod(extent, interval);
      if (method) interval = method[0], skip = method[1];
      function skipped(date) {
        return !isNaN(date) && !interval.range(date, d3_time_scaleDate(+date + 1), skip).length;
      }
      return scale.domain(d3_scale_nice(domain, skip > 1 ? {
        floor: function(date) {
          while (skipped(date = interval.floor(date))) date = d3_time_scaleDate(date - 1);
          return date;
        },
        ceil: function(date) {
          while (skipped(date = interval.ceil(date))) date = d3_time_scaleDate(+date + 1);
          return date;
        }
      } : interval));
    };
    scale.ticks = function(interval, skip) {
      var extent = d3_scaleExtent(scale.domain()), method = interval == null ? tickMethod(extent, 10) : typeof interval === "number" ? tickMethod(extent, interval) : !interval.range && [ {
        range: interval
      }, skip ];
      if (method) interval = method[0], skip = method[1];
      return interval.range(extent[0], d3_time_scaleDate(+extent[1] + 1), skip < 1 ? 1 : skip);
    };
    scale.tickFormat = function() {
      return format;
    };
    scale.copy = function() {
      return d3_time_scale(linear.copy(), methods, format);
    };
    return d3_scale_linearRebind(scale, linear);
  }
  function d3_time_scaleDate(t) {
    return new Date(t);
  }
  var d3_time_scaleSteps = [ 1e3, 5e3, 15e3, 3e4, 6e4, 3e5, 9e5, 18e5, 36e5, 108e5, 216e5, 432e5, 864e5, 1728e5, 6048e5, 2592e6, 7776e6, 31536e6 ];
  var d3_time_scaleLocalMethods = [ [ d3_time.second, 1 ], [ d3_time.second, 5 ], [ d3_time.second, 15 ], [ d3_time.second, 30 ], [ d3_time.minute, 1 ], [ d3_time.minute, 5 ], [ d3_time.minute, 15 ], [ d3_time.minute, 30 ], [ d3_time.hour, 1 ], [ d3_time.hour, 3 ], [ d3_time.hour, 6 ], [ d3_time.hour, 12 ], [ d3_time.day, 1 ], [ d3_time.day, 2 ], [ d3_time.week, 1 ], [ d3_time.month, 1 ], [ d3_time.month, 3 ], [ d3_time.year, 1 ] ];
  var d3_time_scaleLocalFormat = d3_time_format.multi([ [ ".%L", function(d) {
    return d.getMilliseconds();
  } ], [ ":%S", function(d) {
    return d.getSeconds();
  } ], [ "%I:%M", function(d) {
    return d.getMinutes();
  } ], [ "%I %p", function(d) {
    return d.getHours();
  } ], [ "%a %d", function(d) {
    return d.getDay() && d.getDate() != 1;
  } ], [ "%b %d", function(d) {
    return d.getDate() != 1;
  } ], [ "%B", function(d) {
    return d.getMonth();
  } ], [ "%Y", d3_true ] ]);
  var d3_time_scaleMilliseconds = {
    range: function(start, stop, step) {
      return d3.range(Math.ceil(start / step) * step, +stop, step).map(d3_time_scaleDate);
    },
    floor: d3_identity,
    ceil: d3_identity
  };
  d3_time_scaleLocalMethods.year = d3_time.year;
  d3_time.scale = function() {
    return d3_time_scale(d3.scale.linear(), d3_time_scaleLocalMethods, d3_time_scaleLocalFormat);
  };
  var d3_time_scaleUtcMethods = d3_time_scaleLocalMethods.map(function(m) {
    return [ m[0].utc, m[1] ];
  });
  var d3_time_scaleUtcFormat = d3_time_formatUtc.multi([ [ ".%L", function(d) {
    return d.getUTCMilliseconds();
  } ], [ ":%S", function(d) {
    return d.getUTCSeconds();
  } ], [ "%I:%M", function(d) {
    return d.getUTCMinutes();
  } ], [ "%I %p", function(d) {
    return d.getUTCHours();
  } ], [ "%a %d", function(d) {
    return d.getUTCDay() && d.getUTCDate() != 1;
  } ], [ "%b %d", function(d) {
    return d.getUTCDate() != 1;
  } ], [ "%B", function(d) {
    return d.getUTCMonth();
  } ], [ "%Y", d3_true ] ]);
  d3_time_scaleUtcMethods.year = d3_time.year.utc;
  d3_time.scale.utc = function() {
    return d3_time_scale(d3.scale.linear(), d3_time_scaleUtcMethods, d3_time_scaleUtcFormat);
  };
  d3.text = d3_xhrType(function(request) {
    return request.responseText;
  });
  d3.json = function(url, callback) {
    return d3_xhr(url, "application/json", d3_json, callback);
  };
  function d3_json(request) {
    return JSON.parse(request.responseText);
  }
  d3.html = function(url, callback) {
    return d3_xhr(url, "text/html", d3_html, callback);
  };
  function d3_html(request) {
    var range = d3_document.createRange();
    range.selectNode(d3_document.body);
    return range.createContextualFragment(request.responseText);
  }
  d3.xml = d3_xhrType(function(request) {
    return request.responseXML;
  });
  if (typeof define === "function" && define.amd) define('d3/d3',d3); else if (typeof module === "object" && module.exports) module.exports = d3;
  this.d3 = d3;
}();

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: mark@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define('famous/surfaces/ContainerSurface',['require','exports','module','../core/Surface','../core/Context'],function(require, exports, module) {
    var Surface = require('../core/Surface');
    var Context = require('../core/Context');

    /**
     * ContainerSurface is an object designed to contain surfaces and
     *   set properties to be applied to all of them at once.
     *   This extends the Surface class.
     *   A container surface will enforce these properties on the
     *   surfaces it contains:
     *
     *   size (clips contained surfaces to its own width and height);
     *
     *   origin;
     *
     *   its own opacity and transform, which will be automatically
     *   applied to  all Surfaces contained directly and indirectly.
     *
     * @class ContainerSurface
     * @extends Surface
     * @constructor
     * @param {Array.Number} [options.size] [width, height] in pixels
     * @param {Array.string} [options.classes] CSS classes to set on all inner content
     * @param {Array} [options.properties] string dictionary of HTML attributes to set on target div
     * @param {string} [options.content] inner (HTML) content of surface (should not be used)
     */
    function ContainerSurface(options) {
        Surface.call(this, options);
        this._container = document.createElement('div');
        this._container.classList.add('famous-group');
        this._container.classList.add('famous-container-group');
        this._shouldRecalculateSize = false;
        this.context = new Context(this._container);
        this.setContent(this._container);
    }

    ContainerSurface.prototype = Object.create(Surface.prototype);
    ContainerSurface.prototype.constructor = ContainerSurface;
    ContainerSurface.prototype.elementType = 'div';
    ContainerSurface.prototype.elementClass = 'famous-surface';

    /**
     * Add renderables to this object's render tree
     *
     * @method add
     *
     * @param {Object} obj renderable object
     * @return {RenderNode} RenderNode wrapping this object, if not already a RenderNode
     */
    ContainerSurface.prototype.add = function add() {
        return this.context.add.apply(this.context, arguments);
    };

    /**
     * Return spec for this surface.  Note: Can result in a size recalculation.
     *
     * @private
     * @method render
     *
     * @return {Object} render spec for this surface (spec id)
     */
    ContainerSurface.prototype.render = function render() {
        if (this._sizeDirty) this._shouldRecalculateSize = true;
        return Surface.prototype.render.apply(this, arguments);
    };

    /**
     * Place the document element this component manages into the document.
     *
     * @private
     * @method deploy
     * @param {Node} target document parent of this container
     */
    ContainerSurface.prototype.deploy = function deploy() {
        this._shouldRecalculateSize = true;
        return Surface.prototype.deploy.apply(this, arguments);
    };

    /**
     * Apply changes from this component to the corresponding document element.
     * This includes changes to classes, styles, size, content, opacity, origin,
     * and matrix transforms.
     *
     * @private
     * @method commit
     * @param {Context} context commit context
     * @param {Transform} transform unused TODO
     * @param {Number} opacity  unused TODO
     * @param {Array.Number} origin unused TODO
     * @param {Array.Number} size unused TODO
     * @return {undefined} TODO returns an undefined value
     */
    ContainerSurface.prototype.commit = function commit(context, transform, opacity, origin, size) {
        var previousSize = this._size ? [this._size[0], this._size[1]] : null;
        var result = Surface.prototype.commit.apply(this, arguments);
        if (this._shouldRecalculateSize || (previousSize && (this._size[0] !== previousSize[0] || this._size[1] !== previousSize[1]))) {
            this.context.setSize();
            this._shouldRecalculateSize = false;
        }
        this.context.update();
        return result;
    };

    module.exports = ContainerSurface;
});

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */
define('famous/physics/PhysicsEngine',['require','exports','module','../core/EventHandler'],function(require, exports, module) {
    var EventHandler = require('../core/EventHandler');

    /**
     * The Physics Engine is responsible for mediating bodies with their
     *   interaction with forces and constraints (agents). Specifically, it
     *   is responsible for:
     *
     *   - adding and removing bodies
     *   - updating a body's state over time
     *   - attaching and detaching agents
     *   - sleeping upon equillibrium and waking upon excitation
     *
     * @class PhysicsEngine
     * @constructor
     * @param options {Object} options
     */
    function PhysicsEngine(options) {
        this.options = Object.create(PhysicsEngine.DEFAULT_OPTIONS);
        if (options) this.setOptions(options);

        this._particles      = [];   //list of managed particles
        this._bodies         = [];   //list of managed bodies
        this._agentData      = {};   //hash of managed agent data
        this._forces         = [];   //list of Ids of agents that are forces
        this._constraints    = [];   //list of Ids of agents that are constraints

        this._buffer         = 0.0;
        this._prevTime       = now();
        this._isSleeping     = false;
        this._eventHandler   = null;
        this._currAgentId    = 0;
        this._hasBodies      = false;
        this._eventHandler   = null;
    }

    /** const */
    var TIMESTEP = 17;
    var MIN_TIME_STEP = 1000 / 120;
    var MAX_TIME_STEP = 17;

    var now = Date.now;

    // Catalogue of outputted events
    var _events = {
        start : 'start',
        update : 'update',
        end : 'end'
    };

    /**
     * @property PhysicsEngine.DEFAULT_OPTIONS
     * @type Object
     * @protected
     * @static
     */
    PhysicsEngine.DEFAULT_OPTIONS = {

        /**
         * The number of iterations the engine takes to resolve constraints
         * @attribute constraintSteps
         * @type Number
         */
        constraintSteps : 1,

        /**
         * The energy threshold required for the Physics Engine to update
         * @attribute sleepTolerance
         * @type Number
         */
        sleepTolerance : 1e-7,

        /**
         * The maximum velocity magnitude of a physics body
         *      Range : [0, Infinity]
         * @attribute velocityCap
         * @type Number
         */
        velocityCap : undefined,

        /**
         * The maximum angular velocity magnitude of a physics body
         *      Range : [0, Infinity]
         * @attribute angularVelocityCap
         * @type Number
         */
        angularVelocityCap : undefined
    };

    /**
     * Options setter
     *
     * @method setOptions
     * @param opts {Object}
     */
    PhysicsEngine.prototype.setOptions = function setOptions(opts) {
        for (var key in opts) if (this.options[key]) this.options[key] = opts[key];
    };

    /**
     * Method to add a physics body to the engine. Necessary to update the
     *   body over time.
     *
     * @method addBody
     * @param body {Body}
     * @return body {Body}
     */
    PhysicsEngine.prototype.addBody = function addBody(body) {
        body._engine = this;
        if (body.isBody) {
            this._bodies.push(body);
            this._hasBodies = true;
        }
        else this._particles.push(body);
        body.on('start', this.wake.bind(this));
        return body;
    };

    /**
     * Remove a body from the engine. Detaches body from all forces and
     *   constraints.
     *
     * TODO: Fix for in loop
     *
     * @method removeBody
     * @param body {Body}
     */
    PhysicsEngine.prototype.removeBody = function removeBody(body) {
        var array = (body.isBody) ? this._bodies : this._particles;
        var index = array.indexOf(body);
        if (index > -1) {
            for (var agentKey in this._agentData) {
                if (this._agentData.hasOwnProperty(agentKey)) {
                    this.detachFrom(this._agentData[agentKey].id, body);
                }
            }
            array.splice(index,1);
        }
        if (this.getBodies().length === 0) this._hasBodies = false;
    };

    function _mapAgentArray(agent) {
        if (agent.applyForce)      return this._forces;
        if (agent.applyConstraint) return this._constraints;
    }

    function _attachOne(agent, targets, source) {
        if (targets === undefined) targets = this.getParticlesAndBodies();
        if (!(targets instanceof Array)) targets = [targets];

        agent.on('change', this.wake.bind(this));

        this._agentData[this._currAgentId] = {
            agent   : agent,
            id      : this._currAgentId,
            targets : targets,
            source  : source
        };

        _mapAgentArray.call(this, agent).push(this._currAgentId);
        return this._currAgentId++;
    }

    /**
     * Attaches a force or constraint to a Body. Returns an AgentId of the
     *   attached agent which can be used to detach the agent.
     *
     * @method attach
     * @param agents {Agent|Array.Agent} A force, constraint, or array of them.
     * @param [targets=All] {Body|Array.Body} The Body or Bodies affected by the agent
     * @param [source] {Body} The source of the agent
     * @return AgentId {Number}
     */
    PhysicsEngine.prototype.attach = function attach(agents, targets, source) {
        this.wake();

        if (agents instanceof Array) {
            var agentIDs = [];
            for (var i = 0; i < agents.length; i++)
                agentIDs[i] = _attachOne.call(this, agents[i], targets, source);
            return agentIDs;
        }
        else return _attachOne.call(this, agents, targets, source);
    };

    /**
     * Append a body to the targets of a previously defined physics agent.
     *
     * @method attachTo
     * @param agentID {AgentId} The agentId of a previously defined agent
     * @param target {Body} The Body affected by the agent
     */
    PhysicsEngine.prototype.attachTo = function attachTo(agentID, target) {
        _getAgentData.call(this, agentID).targets.push(target);
    };

    /**
     * Undoes PhysicsEngine.attach. Removes an agent and its associated
     *   effect on its affected Bodies.
     *
     * @method detach
     * @param id {AgentId} The agentId of a previously defined agent
     */
    PhysicsEngine.prototype.detach = function detach(id) {
        // detach from forces/constraints array
        var agent = this.getAgent(id);
        var agentArray = _mapAgentArray.call(this, agent);
        var index = agentArray.indexOf(id);
        agentArray.splice(index,1);

        // detach agents array
        delete this._agentData[id];
    };

    /**
     * Remove a single Body from a previously defined agent.
     *
     * @method detach
     * @param id {AgentId} The agentId of a previously defined agent
     * @param target {Body} The body to remove from the agent
     */
    PhysicsEngine.prototype.detachFrom = function detachFrom(id, target) {
        var boundAgent = _getAgentData.call(this, id);
        if (boundAgent.source === target) this.detach(id);
        else {
            var targets = boundAgent.targets;
            var index = targets.indexOf(target);
            if (index > -1) targets.splice(index,1);
        }
    };

    /**
     * A convenience method to give the Physics Engine a clean slate of
     * agents. Preserves all added Body objects.
     *
     * @method detachAll
     */
    PhysicsEngine.prototype.detachAll = function detachAll() {
        this._agentData     = {};
        this._forces        = [];
        this._constraints   = [];
        this._currAgentId   = 0;
    };

    function _getAgentData(id) {
        return this._agentData[id];
    }

    /**
     * Returns the corresponding agent given its agentId.
     *
     * @method getAgent
     * @param id {AgentId}
     */
    PhysicsEngine.prototype.getAgent = function getAgent(id) {
        return _getAgentData.call(this, id).agent;
    };

    /**
     * Returns all particles that are currently managed by the Physics Engine.
     *
     * @method getParticles
     * @return particles {Array.Particles}
     */
    PhysicsEngine.prototype.getParticles = function getParticles() {
        return this._particles;
    };

    /**
     * Returns all bodies, except particles, that are currently managed by the Physics Engine.
     *
     * @method getBodies
     * @return bodies {Array.Bodies}
     */
    PhysicsEngine.prototype.getBodies = function getBodies() {
        return this._bodies;
    };

    /**
     * Returns all bodies that are currently managed by the Physics Engine.
     *
     * @method getBodies
     * @return bodies {Array.Bodies}
     */
    PhysicsEngine.prototype.getParticlesAndBodies = function getParticlesAndBodies() {
        return this.getParticles().concat(this.getBodies());
    };

    /**
     * Iterates over every Particle and applies a function whose first
     *   argument is the Particle
     *
     * @method forEachParticle
     * @param fn {Function} Function to iterate over
     * @param [dt] {Number} Delta time
     */
    PhysicsEngine.prototype.forEachParticle = function forEachParticle(fn, dt) {
        var particles = this.getParticles();
        for (var index = 0, len = particles.length; index < len; index++)
            fn.call(this, particles[index], dt);
    };

    /**
     * Iterates over every Body that isn't a Particle and applies
     *   a function whose first argument is the Body
     *
     * @method forEachBody
     * @param fn {Function} Function to iterate over
     * @param [dt] {Number} Delta time
     */
    PhysicsEngine.prototype.forEachBody = function forEachBody(fn, dt) {
        if (!this._hasBodies) return;
        var bodies = this.getBodies();
        for (var index = 0, len = bodies.length; index < len; index++)
            fn.call(this, bodies[index], dt);
    };

    /**
     * Iterates over every Body and applies a function whose first
     *   argument is the Body
     *
     * @method forEach
     * @param fn {Function} Function to iterate over
     * @param [dt] {Number} Delta time
     */
    PhysicsEngine.prototype.forEach = function forEach(fn, dt) {
        this.forEachParticle(fn, dt);
        this.forEachBody(fn, dt);
    };

    function _updateForce(index) {
        var boundAgent = _getAgentData.call(this, this._forces[index]);
        boundAgent.agent.applyForce(boundAgent.targets, boundAgent.source);
    }

    function _updateForces() {
        for (var index = this._forces.length - 1; index > -1; index--)
            _updateForce.call(this, index);
    }

    function _updateConstraint(index, dt) {
        var boundAgent = this._agentData[this._constraints[index]];
        return boundAgent.agent.applyConstraint(boundAgent.targets, boundAgent.source, dt);
    }

    function _updateConstraints(dt) {
        var iteration = 0;
        while (iteration < this.options.constraintSteps) {
            for (var index = this._constraints.length - 1; index > -1; index--)
                _updateConstraint.call(this, index, dt);
            iteration++;
        }
    }

    function _updateVelocities(body, dt) {
        body.integrateVelocity(dt);
        if (this.options.velocityCap)
            body.velocity.cap(this.options.velocityCap).put(body.velocity);
    }

    function _updateAngularVelocities(body, dt) {
        body.integrateAngularMomentum(dt);
        body.updateAngularVelocity();
        if (this.options.angularVelocityCap)
            body.angularVelocity.cap(this.options.angularVelocityCap).put(body.angularVelocity);
    }

    function _updateOrientations(body, dt) {
        body.integrateOrientation(dt);
    }

    function _updatePositions(body, dt) {
        body.integratePosition(dt);
        body.emit(_events.update, body);
    }

    function _integrate(dt) {
        _updateForces.call(this, dt);
        this.forEach(_updateVelocities, dt);
        this.forEachBody(_updateAngularVelocities, dt);
        _updateConstraints.call(this, dt);
        this.forEachBody(_updateOrientations, dt);
        this.forEach(_updatePositions, dt);
    }

    function _getParticlesEnergy() {
        var energy = 0.0;
        var particleEnergy = 0.0;
        this.forEach(function(particle) {
            particleEnergy = particle.getEnergy();
            energy += particleEnergy;
        });
        return energy;
    }

    function _getAgentsEnergy() {
        var energy = 0;
        for (var id in this._agentData)
            energy += this.getAgentEnergy(id);
        return energy;
    }

    /**
     * Calculates the potential energy of an agent, like a spring, by its Id
     *
     * @method getAgentEnergy
     * @param agentId {Number} The attached agent Id
     * @return energy {Number}
     */
    PhysicsEngine.prototype.getAgentEnergy = function(agentId) {
        var agentData = _getAgentData.call(this, agentId);
        return agentData.agent.getEnergy(agentData.targets, agentData.source);
    };

    /**
     * Calculates the kinetic energy of all Body objects and potential energy
     *   of all attached agents.
     *
     * TODO: implement.
     * @method getEnergy
     * @return energy {Number}
     */
    PhysicsEngine.prototype.getEnergy = function getEnergy() {
        return _getParticlesEnergy.call(this) + _getAgentsEnergy.call(this);
    };

    /**
     * Updates all Body objects managed by the physics engine over the
     *   time duration since the last time step was called.
     *
     * @method step
     */
    PhysicsEngine.prototype.step = function step() {
        if (this.isSleeping()) return;

        //set current frame's time
        var currTime = now();

        //milliseconds elapsed since last frame
        var dtFrame = currTime - this._prevTime;

        this._prevTime = currTime;

        if (dtFrame < MIN_TIME_STEP) return;
        if (dtFrame > MAX_TIME_STEP) dtFrame = MAX_TIME_STEP;

        //robust integration
//        this._buffer += dtFrame;
//        while (this._buffer > this._timestep){
//            _integrate.call(this, this._timestep);
//            this._buffer -= this._timestep;
//        };
//        _integrate.call(this, this._buffer);
//        this._buffer = 0.0;

        _integrate.call(this, TIMESTEP);

        this.emit(_events.update, this);

        if (this.getEnergy() < this.options.sleepTolerance) this.sleep();
    };

    /**
     * Tells whether the Physics Engine is sleeping or awake.
     *
     * @method isSleeping
     * @return {Boolean}
     */
    PhysicsEngine.prototype.isSleeping = function isSleeping() {
        return this._isSleeping;
    };

    /**
     * Tells whether the Physics Engine is sleeping or awake.
     *
     * @method isActive
     * @return {Boolean}
     */
    PhysicsEngine.prototype.isActive = function isSleeping() {
        return !this._isSleeping;
    };

    /**
     * Stops the Physics Engine update loop. Emits an 'end' event.
     *
     * @method sleep
     */
    PhysicsEngine.prototype.sleep = function sleep() {
        if (this._isSleeping) return;
        this.forEach(function(body) {
            body.sleep();
        });
        this.emit(_events.end, this);
        this._isSleeping = true;
    };

    /**
     * Restarts the Physics Engine update loop. Emits an 'start' event.
     *
     * @method wake
     */
    PhysicsEngine.prototype.wake = function wake() {
        if (!this._isSleeping) return;
        this._prevTime = now();
        this.emit(_events.start, this);
        this._isSleeping = false;
    };

    PhysicsEngine.prototype.emit = function emit(type, data) {
        if (this._eventHandler === null) return;
        this._eventHandler.emit(type, data);
    };

    PhysicsEngine.prototype.on = function on(event, fn) {
        if (this._eventHandler === null) this._eventHandler = new EventHandler();
        this._eventHandler.on(event, fn);
    };

    module.exports = PhysicsEngine;
});

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: david@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define('famous/math/Vector',['require','exports','module'],function(require, exports, module) {

    /**
     * Three-element floating point vector.
     *
     * @class Vector
     * @constructor
     *
     * @param {number} x x element value
     * @param {number} y y element value
     * @param {number} z z element value
     */
    function Vector(x,y,z) {
        if (arguments.length === 1 && x !== undefined) this.set(x);
        else {
            this.x = x || 0;
            this.y = y || 0;
            this.z = z || 0;
        }
        return this;
    }

    var _register = new Vector(0,0,0);

    /**
     * Add this element-wise to another Vector, element-wise.
     *   Note: This sets the internal result register, so other references to that vector will change.
     *
     * @method add
     * @param {Vector} v addend
     * @return {Vector} vector sum
     */
    Vector.prototype.add = function add(v) {
        return _setXYZ.call(_register,
            this.x + v.x,
            this.y + v.y,
            this.z + v.z
        );
    };

    /**
     * Subtract another vector from this vector, element-wise.
     *   Note: This sets the internal result register, so other references to that vector will change.
     *
     * @method sub
     * @param {Vector} v subtrahend
     * @return {Vector} vector difference
     */
    Vector.prototype.sub = function sub(v) {
        return _setXYZ.call(_register,
            this.x - v.x,
            this.y - v.y,
            this.z - v.z
        );
    };

    /**
     * Scale Vector by floating point r.
     *   Note: This sets the internal result register, so other references to that vector will change.
     *
     * @method mult
     *
     * @param {number} r scalar
     * @return {Vector} vector result
     */
    Vector.prototype.mult = function mult(r) {
        return _setXYZ.call(_register,
            r * this.x,
            r * this.y,
            r * this.z
        );
    };

    /**
     * Scale Vector by floating point 1/r.
     *   Note: This sets the internal result register, so other references to that vector will change.
     *
     * @method div
     *
     * @param {number} r scalar
     * @return {Vector} vector result
     */
    Vector.prototype.div = function div(r) {
        return this.mult(1 / r);
    };

    /**
     * Given another vector v, return cross product (v)x(this).
     *   Note: This sets the internal result register, so other references to that vector will change.
     *
     * @method cross
     * @param {Vector} v Left Hand Vector
     * @return {Vector} vector result
     */
    Vector.prototype.cross = function cross(v) {
        var x = this.x;
        var y = this.y;
        var z = this.z;
        var vx = v.x;
        var vy = v.y;
        var vz = v.z;

        return _setXYZ.call(_register,
            z * vy - y * vz,
            x * vz - z * vx,
            y * vx - x * vy
        );
    };

    /**
     * Component-wise equality test between this and Vector v.
     * @method equals
     * @param {Vector} v vector to compare
     * @return {boolean}
     */
    Vector.prototype.equals = function equals(v) {
        return (v.x === this.x && v.y === this.y && v.z === this.z);
    };

    /**
     * Rotate clockwise around x-axis by theta radians.
     *   Note: This sets the internal result register, so other references to that vector will change.
     * @method rotateX
     * @param {number} theta radians
     * @return {Vector} rotated vector
     */
    Vector.prototype.rotateX = function rotateX(theta) {
        var x = this.x;
        var y = this.y;
        var z = this.z;

        var cosTheta = Math.cos(theta);
        var sinTheta = Math.sin(theta);

        return _setXYZ.call(_register,
            x,
            y * cosTheta - z * sinTheta,
            y * sinTheta + z * cosTheta
        );
    };

    /**
     * Rotate clockwise around y-axis by theta radians.
     *   Note: This sets the internal result register, so other references to that vector will change.
     * @method rotateY
     * @param {number} theta radians
     * @return {Vector} rotated vector
     */
    Vector.prototype.rotateY = function rotateY(theta) {
        var x = this.x;
        var y = this.y;
        var z = this.z;

        var cosTheta = Math.cos(theta);
        var sinTheta = Math.sin(theta);

        return _setXYZ.call(_register,
            z * sinTheta + x * cosTheta,
            y,
            z * cosTheta - x * sinTheta
        );
    };

    /**
     * Rotate clockwise around z-axis by theta radians.
     *   Note: This sets the internal result register, so other references to that vector will change.
     * @method rotateZ
     * @param {number} theta radians
     * @return {Vector} rotated vector
     */
    Vector.prototype.rotateZ = function rotateZ(theta) {
        var x = this.x;
        var y = this.y;
        var z = this.z;

        var cosTheta = Math.cos(theta);
        var sinTheta = Math.sin(theta);

        return _setXYZ.call(_register,
            x * cosTheta - y * sinTheta,
            x * sinTheta + y * cosTheta,
            z
        );
    };

    /**
     * Return dot product of this with a second Vector
     * @method dot
     * @param {Vector} v second vector
     * @return {number} dot product
     */
    Vector.prototype.dot = function dot(v) {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    };

    /**
     * Return squared length of this vector
     * @method normSquared
     * @return {number} squared length
     */
    Vector.prototype.normSquared = function normSquared() {
        return this.dot(this);
    };

    /**
     * Return length of this vector
     * @method norm
     * @return {number} length
     */
    Vector.prototype.norm = function norm() {
        return Math.sqrt(this.normSquared());
    };

    /**
     * Scale Vector to specified length.
     *   If length is less than internal tolerance, set vector to [length, 0, 0].
     *   Note: This sets the internal result register, so other references to that vector will change.
     * @method normalize
     *
     * @param {number} length target length, default 1.0
     * @return {Vector}
     */
    Vector.prototype.normalize = function normalize(length) {
        if (arguments.length === 0) length = 1;
        var norm = this.norm();

        if (norm > 1e-7) return _setFromVector.call(_register, this.mult(length / norm));
        else return _setXYZ.call(_register, length, 0, 0);
    };

    /**
     * Make a separate copy of the Vector.
     *
     * @method clone
     *
     * @return {Vector}
     */
    Vector.prototype.clone = function clone() {
        return new Vector(this);
    };

    /**
     * True if and only if every value is 0 (or falsy)
     *
     * @method isZero
     *
     * @return {boolean}
     */
    Vector.prototype.isZero = function isZero() {
        return !(this.x || this.y || this.z);
    };

    function _setXYZ(x,y,z) {
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
    }

    function _setFromArray(v) {
        return _setXYZ.call(this,v[0],v[1],v[2] || 0);
    }

    function _setFromVector(v) {
        return _setXYZ.call(this, v.x, v.y, v.z);
    }

    function _setFromNumber(x) {
        return _setXYZ.call(this,x,0,0);
    }

    /**
     * Set this Vector to the values in the provided Array or Vector.
     *
     * @method set
     * @param {object} v array, Vector, or number
     * @return {Vector} this
     */
    Vector.prototype.set = function set(v) {
        if (v instanceof Array) return _setFromArray.call(this, v);
        if (typeof v === 'number') return _setFromNumber.call(this, v);
        return _setFromVector.call(this, v);
    };

    Vector.prototype.setXYZ = function(x,y,z) {
        return _setXYZ.apply(this, arguments);
    };

    Vector.prototype.set1D = function(x) {
        return _setFromNumber.call(this, x);
    };

    /**
     * Put result of last internal register calculation in specified output vector.
     *
     * @method put
     * @param {Vector} v destination vector
     * @return {Vector} destination vector
     */

    Vector.prototype.put = function put(v) {
        if (this === _register) _setFromVector.call(v, _register);
        else _setFromVector.call(v, this);
    };

    /**
     * Set this vector to [0,0,0]
     *
     * @method clear
     */
    Vector.prototype.clear = function clear() {
        return _setXYZ.call(this,0,0,0);
    };

    /**
     * Scale this Vector down to specified "cap" length.
     *   If Vector shorter than cap, or cap is Infinity, do nothing.
     *   Note: This sets the internal result register, so other references to that vector will change.
     *
     * @method cap
     * @return {Vector} capped vector
     */
    Vector.prototype.cap = function cap(cap) {
        if (cap === Infinity) return _setFromVector.call(_register, this);
        var norm = this.norm();
        if (norm > cap) return _setFromVector.call(_register, this.mult(cap / norm));
        else return _setFromVector.call(_register, this);
    };

    /**
     * Return projection of this Vector onto another.
     *   Note: This sets the internal result register, so other references to that vector will change.
     *
     * @method project
     * @param {Vector} n vector to project upon
     * @return {Vector} projected vector
     */
    Vector.prototype.project = function project(n) {
        return n.mult(this.dot(n));
    };

    /**
     * Reflect this Vector across provided vector.
     *   Note: This sets the internal result register, so other references to that vector will change.
     *
     * @method reflectAcross
     * @param {Vector} n vector to reflect across
     * @return {Vector} reflected vector
     */
    Vector.prototype.reflectAcross = function reflectAcross(n) {
        n.normalize().put(n);
        return _setFromVector(_register, this.sub(this.project(n).mult(2)));
    };

    /**
     * Convert Vector to three-element array.
     *
     * @method get
     * @return {array<number>} three-element array
     */
    Vector.prototype.get = function get() {
        return [this.x, this.y, this.z];
    };

    Vector.prototype.get1D = function() {
        return this.x;
    };

    module.exports = Vector;

});

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: david@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define('famous/physics/integrators/SymplecticEuler',['require','exports','module'],function(require, exports, module) {

    /**
     * Ordinary Differential Equation (ODE) Integrator.
     * Manages updating a physics body's state over time.
     *
     *  p = position, v = velocity, m = mass, f = force, dt = change in time
     *
     *      v <- v + dt * f / m
     *      p <- p + dt * v
     *
     *  q = orientation, w = angular velocity, L = angular momentum
     *
     *      L <- L + dt * t
     *      q <- q + dt/2 * q * w
     *
     * @class SymplecticEuler
     * @constructor
     * @param {Object} options Options to set
     */
    var SymplecticEuler = {};

    /*
     * Updates the velocity of a physics body from its accumulated force.
     *      v <- v + dt * f / m
     *
     * @method integrateVelocity
     * @param {Body} physics body
     * @param {Number} dt delta time
     */
    SymplecticEuler.integrateVelocity = function integrateVelocity(body, dt) {
        var v = body.velocity;
        var w = body.inverseMass;
        var f = body.force;

        if (f.isZero()) return;

        v.add(f.mult(dt * w)).put(v);
        f.clear();
    };

    /*
     * Updates the position of a physics body from its velocity.
     *      p <- p + dt * v
     *
     * @method integratePosition
     * @param {Body} physics body
     * @param {Number} dt delta time
     */
    SymplecticEuler.integratePosition = function integratePosition(body, dt) {
        var p = body.position;
        var v = body.velocity;

        p.add(v.mult(dt)).put(p);
    };

    /*
     * Updates the angular momentum of a physics body from its accumuled torque.
     *      L <- L + dt * t
     *
     * @method integrateAngularMomentum
     * @param {Body} physics body (except a particle)
     * @param {Number} dt delta time
     */
    SymplecticEuler.integrateAngularMomentum = function integrateAngularMomentum(body, dt) {
        var L = body.angularMomentum;
        var t = body.torque;

        if (t.isZero()) return;

        L.add(t.mult(dt)).put(L);
        t.clear();
    };

    /*
     * Updates the orientation of a physics body from its angular velocity.
     *      q <- q + dt/2 * q * w
     *
     * @method integrateOrientation
     * @param {Body} physics body (except a particle)
     * @param {Number} dt delta time
     */
    SymplecticEuler.integrateOrientation = function integrateOrientation(body, dt) {
        var q = body.orientation;
        var w = body.angularVelocity;

        if (w.isZero()) return;
        q.add(q.multiply(w).scalarMultiply(0.5 * dt)).put(q);
//        q.normalize.put(q);
    };

    module.exports = SymplecticEuler;
});

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: david@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define('famous/physics/bodies/Particle',['require','exports','module','../../math/Vector','../../core/Transform','../../core/EventHandler','../integrators/SymplecticEuler'],function(require, exports, module) {
    var Vector = require('../../math/Vector');
    var Transform = require('../../core/Transform');
    var EventHandler = require('../../core/EventHandler');
    var Integrator = require('../integrators/SymplecticEuler');

    /**
     * A point body that is controlled by the Physics Engine. A particle has
     *   position and velocity states that are updated by the Physics Engine.
     *   Ultimately, a particle is a special type of modifier, and can be added to
     *   the Famo.us Scene Graph like any other modifier.
     *
     * @class Particle
     * @uses EventHandler
     * @extensionfor Body
     *
     * @param [options] {Options}           An object of configurable options.
     * @param [options.position] {Array}    The position of the particle.
     * @param [options.velocity] {Array}    The velocity of the particle.
     * @param [options.mass] {Number}       The mass of the particle.
     */
     function Particle(options) {
        options = options || {};
        var defaults = Particle.DEFAULT_OPTIONS;

        // registers
        this.position = new Vector();
        this.velocity = new Vector();
        this.force = new Vector();

        // state variables
        this._engine = null;
        this._isSleeping = true;
        this._eventOutput = null;

        // set scalars
        this.mass = (options.mass !== undefined)
            ? options.mass
            : defaults.mass;

        this.inverseMass = 1 / this.mass;

        // set vectors
        this.setPosition(options.position || defaults.position);
        this.setVelocity(options.velocity || defaults.velocity);
        this.force.set(options.force || [0,0,0]);

        this.transform = Transform.identity.slice();

        // cached _spec
        this._spec = {
            size : [true, true],
            target : {
                transform : this.transform,
                origin : [0.5, 0.5],
                target : null
            }
        };
    }

    Particle.DEFAULT_OPTIONS = {
        position : [0, 0, 0],
        velocity : [0, 0, 0],
        mass : 1
    };

    //Catalogue of outputted events
    var _events = {
        start : 'start',
        update : 'update',
        end : 'end'
    };

    // Cached timing function
    var now = Date.now;

    /**
     * @attribute isBody
     * @type Boolean
     * @static
     */
    Particle.prototype.isBody = false;

    /**
     * Determines if particle is active
     *
     * @method isActive
     * @return {Boolean}
     */
    Particle.prototype.isActive = function isActive() {
        return !this._isSleeping;
    };

    /**
     * Stops the particle from updating
     *
     * @method sleep
     */
    Particle.prototype.sleep = function sleep() {
        if (this._isSleeping) return;
        this.emit(_events.end, this);
        this._isSleeping = true;
    };

    /**
     * Starts the particle update
     *
     * @method wake
     */
    Particle.prototype.wake = function wake() {
        if (!this._isSleeping) return;
        this.emit(_events.start, this);
        this._isSleeping = false;
        this._prevTime = now();
        if (this._engine) this._engine.wake();
    };

    /**
     * Basic setter for position
     *
     * @method setPosition
     * @param position {Array|Vector}
     */
    Particle.prototype.setPosition = function setPosition(position) {
        this.position.set(position);
    };

    /**
     * 1-dimensional setter for position
     *
     * @method setPosition1D
     * @param x {Number}
     */
    Particle.prototype.setPosition1D = function setPosition1D(x) {
        this.position.x = x;
    };

    /**
     * Basic getter function for position
     *
     * @method getPosition
     * @return position {Array}
     */
    Particle.prototype.getPosition = function getPosition() {
        this._engine.step();
        return this.position.get();
    };

    /**
     * 1-dimensional getter for position
     *
     * @method getPosition1D
     * @return value {Number}
     */
    Particle.prototype.getPosition1D = function getPosition1D() {
        this._engine.step();
        return this.position.x;
    };

    /**
     * Basic setter function for velocity Vector
     *
     * @method setVelocity
     * @function
     */
    Particle.prototype.setVelocity = function setVelocity(velocity) {
        this.velocity.set(velocity);
        if (!(velocity[0] === 0 && velocity[1] === 0 && velocity[2] === 0))
            this.wake();
    };

    /**
     * 1-dimensional setter for velocity
     *
     * @method setVelocity1D
     * @param x {Number}
     */
    Particle.prototype.setVelocity1D = function setVelocity1D(x) {
        this.velocity.x = x;
        if (x !== 0) this.wake();
    };

    /**
     * Basic getter function for velocity Vector
     *
     * @method getVelocity
     * @return velocity {Array}
     */
    Particle.prototype.getVelocity = function getVelocity() {
        return this.velocity.get();
    };

    /**
     * Basic setter function for force Vector
     *
     * @method setForce
     * @return force {Array}
     */
    Particle.prototype.setForce = function setForce(force) {
        this.force.set(force);
        this.wake();
    };

    /**
     * 1-dimensional getter for velocity
     *
     * @method getVelocity1D
     * @return velocity {Number}
     */
    Particle.prototype.getVelocity1D = function getVelocity1D() {
        return this.velocity.x;
    };

    /**
     * Basic setter function for mass quantity
     *
     * @method setMass
     * @param mass {Number} mass
     */
    Particle.prototype.setMass = function setMass(mass) {
        this.mass = mass;
        this.inverseMass = 1 / mass;
    };

    /**
     * Basic getter function for mass quantity
     *
     * @method getMass
     * @return mass {Number}
     */
    Particle.prototype.getMass = function getMass() {
        return this.mass;
    };

    /**
     * Reset position and velocity
     *
     * @method reset
     * @param position {Array|Vector}
     * @param velocity {Array|Vector}
     */
    Particle.prototype.reset = function reset(position, velocity) {
        this.setPosition(position || [0,0,0]);
        this.setVelocity(velocity || [0,0,0]);
    };

    /**
     * Add force vector to existing internal force Vector
     *
     * @method applyForce
     * @param force {Vector}
     */
    Particle.prototype.applyForce = function applyForce(force) {
        if (force.isZero()) return;
        this.force.add(force).put(this.force);
        this.wake();
    };

    /**
     * Add impulse (change in velocity) Vector to this Vector's velocity.
     *
     * @method applyImpulse
     * @param impulse {Vector}
     */
    Particle.prototype.applyImpulse = function applyImpulse(impulse) {
        if (impulse.isZero()) return;
        var velocity = this.velocity;
        velocity.add(impulse.mult(this.inverseMass)).put(velocity);
    };

    /**
     * Update a particle's velocity from its force accumulator
     *
     * @method integrateVelocity
     * @param dt {Number} Time differential
     */
    Particle.prototype.integrateVelocity = function integrateVelocity(dt) {
        Integrator.integrateVelocity(this, dt);
    };

    /**
     * Update a particle's position from its velocity
     *
     * @method integratePosition
     * @param dt {Number} Time differential
     */
    Particle.prototype.integratePosition = function integratePosition(dt) {
        Integrator.integratePosition(this, dt);
    };

    /**
     * Update the position and velocity of the particle
     *
     * @method _integrate
     * @protected
     * @param dt {Number} Time differential
     */
    Particle.prototype._integrate = function _integrate(dt) {
        this.integrateVelocity(dt);
        this.integratePosition(dt);
    };

    /**
     * Get kinetic energy of the particle.
     *
     * @method getEnergy
     * @function
     */
    Particle.prototype.getEnergy = function getEnergy() {
        return 0.5 * this.mass * this.velocity.normSquared();
    };

    /**
     * Generate transform from the current position state
     *
     * @method getTransform
     * @return Transform {Transform}
     */
    Particle.prototype.getTransform = function getTransform() {
        this._engine.step();

        var position = this.position;
        var transform = this.transform;

        transform[12] = position.x;
        transform[13] = position.y;
        transform[14] = position.z;
        return transform;
    };

    /**
     * The modify interface of a Modifier
     *
     * @method modify
     * @param target {Spec}
     * @return Spec {Spec}
     */
    Particle.prototype.modify = function modify(target) {
        var _spec = this._spec.target;
        _spec.transform = this.getTransform();
        _spec.target = target;
        return this._spec;
    };

    // private
    function _createEventOutput() {
        this._eventOutput = new EventHandler();
        this._eventOutput.bindThis(this);
        EventHandler.setOutputHandler(this, this._eventOutput);
    }

    Particle.prototype.emit = function emit(type, data) {
        if (!this._eventOutput) return;
        this._eventOutput.emit(type, data);
    };

    Particle.prototype.on = function on() {
        _createEventOutput.call(this);
        return this.on.apply(this, arguments);
    };

    Particle.prototype.removeListener = function removeListener() {
        _createEventOutput.call(this);
        return this.removeListener.apply(this, arguments);
    };

    Particle.prototype.pipe = function pipe() {
        _createEventOutput.call(this);
        return this.pipe.apply(this, arguments);
    };

    Particle.prototype.unpipe = function unpipe() {
        _createEventOutput.call(this);
        return this.unpipe.apply(this, arguments);
    };

    module.exports = Particle;
});

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: david@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define('famous/physics/forces/Force',['require','exports','module','../../math/Vector','../../core/EventHandler'],function(require, exports, module) {
    var Vector = require('../../math/Vector');
    var EventHandler = require('../../core/EventHandler');

    /**
     * Force base class.
     *
     * @class Force
     * @uses EventHandler
     * @constructor
     */
    function Force(force) {
        this.force = new Vector(force);
        this._eventOutput = new EventHandler();
        EventHandler.setOutputHandler(this, this._eventOutput);
    }

    /**
     * Basic setter for options
     *
     * @method setOptions
     * @param options {Objects}
     */
    Force.prototype.setOptions = function setOptions(options) {
        this._eventOutput.emit('change', options);
    };

    /**
     * Adds a force to a physics body's force accumulator.
     *
     * @method applyForce
     * @param targets {Array.Body} Array of bodies to apply a force to.
     */
    Force.prototype.applyForce = function applyForce(targets) {
        var length = targets.length;
        while (length--) {
            targets[length].applyForce(this.force);
        }
    };

    /**
     * Getter for a force's potential energy.
     *
     * @method getEnergy
     * @return energy {Number}
     */
    Force.prototype.getEnergy = function getEnergy() {
        return 0.0;
    };

    module.exports = Force;
});

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: david@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define('famous/physics/forces/Drag',['require','exports','module','./Force'],function(require, exports, module) {
    var Force = require('./Force');

    /**
     * Drag is a force that opposes velocity. Attach it to the physics engine
     * to slow down a physics body in motion.
     *
     * @class Drag
     * @constructor
     * @extends Force
     * @param {Object} options options to set on drag
     */
    function Drag(options) {
        this.options = Object.create(this.constructor.DEFAULT_OPTIONS);
        if (options) this.setOptions(options);

        Force.call(this);
    }

    Drag.prototype = Object.create(Force.prototype);
    Drag.prototype.constructor = Drag;

    /**
     * @property Drag.FORCE_FUNCTIONS
     * @type Object
     * @protected
     * @static
     */
    Drag.FORCE_FUNCTIONS = {

        /**
         * A drag force proportional to the velocity
         * @attribute LINEAR
         * @type Function
         * @param {Vector} velocity
         * @return {Vector} drag force
         */
        LINEAR : function(velocity) {
            return velocity;
        },

        /**
         * A drag force proportional to the square of the velocity
         * @attribute QUADRATIC
         * @type Function
         * @param {Vector} velocity
         * @return {Vector} drag force
         */
        QUADRATIC : function(velocity) {
            return velocity.mult(velocity.norm());
        }
    };

    /**
     * @property Drag.DEFAULT_OPTIONS
     * @type Object
     * @protected
     * @static
     */
    Drag.DEFAULT_OPTIONS = {

        /**
         * The strength of the force
         *    Range : [0, 0.1]
         * @attribute strength
         * @type Number
         * @default 0.01
         */
        strength : 0.01,

        /**
         * The type of opposing force
         * @attribute forceFunction
         * @type Function
         */
        forceFunction : Drag.FORCE_FUNCTIONS.LINEAR
    };

    /**
     * Adds a drag force to a physics body's force accumulator.
     *
     * @method applyForce
     * @param targets {Array.Body} Array of bodies to apply drag force to.
     */
    Drag.prototype.applyForce = function applyForce(targets) {
        var strength        = this.options.strength;
        var forceFunction   = this.options.forceFunction;
        var force           = this.force;
        var index;
        var particle;

        for (index = 0; index < targets.length; index++) {
            particle = targets[index];
            forceFunction(particle.velocity).mult(-strength).put(force);
            particle.applyForce(force);
        }
    };

    /**
     * Basic options setter
     *
     * @method setOptions
     * @param {Objects} options
     */
    Drag.prototype.setOptions = function setOptions(options) {
        for (var key in options) this.options[key] = options[key];
    };

    module.exports = Drag;
});

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: david@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

/*global console */

define('famous/physics/forces/Spring',['require','exports','module','./Force','../../math/Vector'],function(require, exports, module) {
    var Force = require('./Force');
    var Vector = require('../../math/Vector');

    /**
     *  A force that moves a physics body to a location with a spring motion.
     *    The body can be moved to another physics body, or an anchor point.
     *
     *  @class Spring
     *  @constructor
     *  @extends Force
     *  @param {Object} options options to set on drag
     */
    function Spring(options) {
        Force.call(this);

        this.options = Object.create(this.constructor.DEFAULT_OPTIONS);
        if (options) this.setOptions(options);

        //registers
        this.disp = new Vector(0,0,0);

        _init.call(this);
    }

    Spring.prototype = Object.create(Force.prototype);
    Spring.prototype.constructor = Spring;

    /** @const */
    var pi = Math.PI;
    var MIN_PERIOD = 150;

    /**
     * @property Spring.FORCE_FUNCTIONS
     * @type Object
     * @protected
     * @static
     */
    Spring.FORCE_FUNCTIONS = {

        /**
         * A FENE (Finitely Extensible Nonlinear Elastic) spring force
         *      see: http://en.wikipedia.org/wiki/FENE
         * @attribute FENE
         * @type Function
         * @param {Number} dist current distance target is from source body
         * @param {Number} rMax maximum range of influence
         * @return {Number} unscaled force
         */
        FENE : function(dist, rMax) {
            var rMaxSmall = rMax * .99;
            var r = Math.max(Math.min(dist, rMaxSmall), -rMaxSmall);
            return r / (1 - r * r/(rMax * rMax));
        },

        /**
         * A Hookean spring force, linear in the displacement
         *      see: http://en.wikipedia.org/wiki/Hooke's_law
         * @attribute FENE
         * @type Function
         * @param {Number} dist current distance target is from source body
         * @return {Number} unscaled force
         */
        HOOK : function(dist) {
            return dist;
        }
    };

    /**
     * @property Spring.DEFAULT_OPTIONS
     * @type Object
     * @protected
     * @static
     */
    Spring.DEFAULT_OPTIONS = {

        /**
         * The amount of time in milliseconds taken for one complete oscillation
         * when there is no damping
         *    Range : [150, Infinity]
         * @attribute period
         * @type Number
         * @default 300
         */
        period : 300,

        /**
         * The damping of the spring.
         *    Range : [0, 1]
         *    0 = no damping, and the spring will oscillate forever
         *    1 = critically damped (the spring will never oscillate)
         * @attribute dampingRatio
         * @type Number
         * @default 0.1
         */
        dampingRatio : 0.1,

        /**
         * The rest length of the spring
         *    Range : [0, Infinity]
         * @attribute length
         * @type Number
         * @default 0
         */
        length : 0,

        /**
         * The maximum length of the spring (for a FENE spring)
         *    Range : [0, Infinity]
         * @attribute length
         * @type Number
         * @default Infinity
         */
        maxLength : Infinity,

        /**
         * The location of the spring's anchor, if not another physics body
         *
         * @attribute anchor
         * @type Array
         * @optional
         */
        anchor : undefined,

        /**
         * The type of spring force
         * @attribute forceFunction
         * @type Function
         */
        forceFunction : Spring.FORCE_FUNCTIONS.HOOK
    };

    function _calcStiffness() {
        var options = this.options;
        options.stiffness = Math.pow(2 * pi / options.period, 2);
    }

    function _calcDamping() {
        var options = this.options;
        options.damping = 4 * pi * options.dampingRatio / options.period;
    }

    function _init() {
        _calcStiffness.call(this);
        _calcDamping.call(this);
    }

    /**
     * Basic options setter
     *
     * @method setOptions
     * @param options {Object}
     */
    Spring.prototype.setOptions = function setOptions(options) {
        // TODO fix no-console error
        /* eslint no-console: 0 */

        if (options.anchor !== undefined) {
            if (options.anchor.position instanceof Vector) this.options.anchor = options.anchor.position;
            if (options.anchor instanceof Vector) this.options.anchor = options.anchor;
            if (options.anchor instanceof Array)  this.options.anchor = new Vector(options.anchor);
        }

        if (options.period !== undefined){
            if (options.period < MIN_PERIOD) {
                options.period = MIN_PERIOD;
                console.warn('The period of a SpringTransition is capped at ' + MIN_PERIOD + ' ms. Use a SnapTransition for faster transitions');
            }
            this.options.period = options.period;
        }

        if (options.dampingRatio !== undefined) this.options.dampingRatio = options.dampingRatio;
        if (options.length !== undefined) this.options.length = options.length;
        if (options.forceFunction !== undefined) this.options.forceFunction = options.forceFunction;
        if (options.maxLength !== undefined) this.options.maxLength = options.maxLength;

        _init.call(this);
        Force.prototype.setOptions.call(this, options);
    };

    /**
     * Adds a spring force to a physics body's force accumulator.
     *
     * @method applyForce
     * @param targets {Array.Body} Array of bodies to apply force to.
     */
    Spring.prototype.applyForce = function applyForce(targets, source) {
        var force = this.force;
        var disp = this.disp;
        var options = this.options;

        var stiffness = options.stiffness;
        var damping = options.damping;
        var restLength = options.length;
        var maxLength = options.maxLength;
        var anchor = options.anchor || source.position;
        var forceFunction = options.forceFunction;

        var i;
        var target;
        var p2;
        var v2;
        var dist;
        var m;

        for (i = 0; i < targets.length; i++) {
            target = targets[i];
            p2 = target.position;
            v2 = target.velocity;

            anchor.sub(p2).put(disp);
            dist = disp.norm() - restLength;

            if (dist === 0) return;

            //if dampingRatio specified, then override strength and damping
            m      = target.mass;
            stiffness *= m;
            damping   *= m;

            disp.normalize(stiffness * forceFunction(dist, maxLength))
                .put(force);

            if (damping)
                if (source) force.add(v2.sub(source.velocity).mult(-damping)).put(force);
                else force.add(v2.mult(-damping)).put(force);

            target.applyForce(force);
            if (source) source.applyForce(force.mult(-1));
        }
    };

    /**
     * Calculates the potential energy of the spring.
     *
     * @method getEnergy
     * @param [targets] target  The physics body attached to the spring
     * @return {source}         The potential energy of the spring
     */
    Spring.prototype.getEnergy = function getEnergy(targets, source) {
        var options     = this.options;
        var restLength  = options.length;
        var anchor      = (source) ? source.position : options.anchor;
        var strength    = options.stiffness;

        var energy = 0.0;
        for (var i = 0; i < targets.length; i++){
            var target = targets[i];
            var dist = anchor.sub(target.position).norm() - restLength;
            energy += 0.5 * strength * dist * dist;
        }
        return energy;
    };

    module.exports = Spring;
});

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: mark@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define('famous/core/ViewSequence',['require','exports','module'],function(require, exports, module) {

    /**
     * Helper object used to iterate through items sequentially. Used in
     *   views that deal with layout.  A ViewSequence object conceptually points
     *   to a node in a linked list.
     *
     * @class ViewSequence
     *
     * @constructor
     * @param {Object|Array} options Options object, or content array.
     * @param {Number} [options.index] starting index.
     * @param {Number} [options.array] Array of elements to populate the ViewSequence
     * @param {Object} [options._] Optional backing store (internal
     * @param {Boolean} [options.loop] Whether to wrap when accessing elements just past the end
     *   (or beginning) of the sequence.
     */
    function ViewSequence(options) {
        if (!options) options = [];
        if (options instanceof Array) options = {array: options};

        this._ = null;
        this.index = options.index || 0;

        if (options.array) this._ = new (this.constructor.Backing)(options.array);
        else if (options._) this._ = options._;

        if (this.index === this._.firstIndex) this._.firstNode = this;
        if (this.index === this._.firstIndex + this._.array.length - 1) this._.lastNode = this;

        if (options.loop !== undefined) this._.loop = options.loop;

        if (options.trackSize !== undefined) this._.trackSize = options.trackSize;

        this._previousNode = null;
        this._nextNode = null;
    }

    // constructor for internal storage
    ViewSequence.Backing = function Backing(array) {
        this.array = array;
        this.firstIndex = 0;
        this.loop = false;
        this.firstNode = null;
        this.lastNode = null;
        this.cumulativeSizes = [[0, 0]];
        this.sizeDirty = true;
        this.trackSize = false;
    };

    // Get value "i" slots away from the first index.
    ViewSequence.Backing.prototype.getValue = function getValue(i) {
        var _i = i - this.firstIndex;
        if (_i < 0 || _i >= this.array.length) return null;
        return this.array[_i];
    };

    // Set value "i" slots away from the first index.
    ViewSequence.Backing.prototype.setValue = function setValue(i, value) {
        this.array[i - this.firstIndex] = value;
    };

    // Get sequence size from backing up to index
    // TODO: remove from viewSequence with proper abstraction
    ViewSequence.Backing.prototype.getSize = function getSize(index) {
        return this.cumulativeSizes[index];
    };

    // Calculates cumulative size
    // TODO: remove from viewSequence with proper abstraction
    ViewSequence.Backing.prototype.calculateSize = function calculateSize(index) {
        index = index || this.array.length;
        var size = [0, 0];
        for (var i = 0; i < index; i++) {
            var nodeSize = this.array[i].getSize();
            if (!nodeSize) return undefined;
            if (size[0] !== undefined) {
                if (nodeSize[0] === undefined) size[0] = undefined;
                else size[0] += nodeSize[0];
            }
            if (size[1] !== undefined) {
                if (nodeSize[1] === undefined) size[1] = undefined;
                else size[1] += nodeSize[1];
            }
            this.cumulativeSizes[i + 1] = size.slice();
        }
        this.sizeDirty = false;
        return size;
    };

    // After splicing into the backing store, restore the indexes of each node correctly.
    ViewSequence.Backing.prototype.reindex = function reindex(start, removeCount, insertCount) {
        if (!this.array[0]) return;

        var i = 0;
        var index = this.firstIndex;
        var indexShiftAmount = insertCount - removeCount;
        var node = this.firstNode;

        // find node to begin
        while (index < start - 1) {
            node = node.getNext();
            index++;
        }
        // skip removed nodes
        var spliceStartNode = node;
        for (i = 0; i < removeCount; i++) {
            node = node.getNext();
            if (node) node._previousNode = spliceStartNode;
        }
        var spliceResumeNode = node ? node.getNext() : null;
        // generate nodes for inserted items
        spliceStartNode._nextNode = null;
        node = spliceStartNode;
        for (i = 0; i < insertCount; i++) node = node.getNext();
        index += insertCount;
        // resume the chain
        if (node !== spliceResumeNode) {
            node._nextNode = spliceResumeNode;
            if (spliceResumeNode) spliceResumeNode._previousNode = node;
        }
        if (spliceResumeNode) {
            node = spliceResumeNode;
            index++;
            while (node && index < this.array.length + this.firstIndex) {
                if (node._nextNode) node.index += indexShiftAmount;
                else node.index = index;
                node = node.getNext();
                index++;
            }
        }
        if (this.trackSize) this.sizeDirty = true;
    };

    /**
     * Return ViewSequence node previous to this node in the list, respecting looping if applied.
     *
     * @method getPrevious
     * @return {ViewSequence} previous node.
     */
    ViewSequence.prototype.getPrevious = function getPrevious() {
        var len = this._.array.length;
        if (!len) {
            this._previousNode = null;
        }
        else if (this.index === this._.firstIndex) {
            if (this._.loop) {
                this._previousNode = this._.lastNode || new (this.constructor)({_: this._, index: this._.firstIndex + len - 1});
                this._previousNode._nextNode = this;
            }
            else {
                this._previousNode = null;
            }
        }
        else if (!this._previousNode) {
            this._previousNode = new (this.constructor)({_: this._, index: this.index - 1});
            this._previousNode._nextNode = this;
        }
        return this._previousNode;
    };

    /**
     * Return ViewSequence node next after this node in the list, respecting looping if applied.
     *
     * @method getNext
     * @return {ViewSequence} previous node.
     */
    ViewSequence.prototype.getNext = function getNext() {
        var len = this._.array.length;
        if (!len) {
            this._nextNode = null;
        }
        else if (this.index === this._.firstIndex + len - 1) {
            if (this._.loop) {
                this._nextNode = this._.firstNode || new (this.constructor)({_: this._, index: this._.firstIndex});
                this._nextNode._previousNode = this;
            }
            else {
                this._nextNode = null;
            }
        }
        else if (!this._nextNode) {
            this._nextNode = new (this.constructor)({_: this._, index: this.index + 1});
            this._nextNode._previousNode = this;
        }
        return this._nextNode;
    };

    /**
     * Return index of the provided item in the backing array
     *
     * @method indexOf
     * @return {Number} index or -1 if not found
     */
    ViewSequence.prototype.indexOf = function indexOf(item) {
        return this._.array.indexOf(item);
    };

    /**
     * Return index of this ViewSequence node.
     *
     * @method getIndex
     * @return {Number} index
     */
    ViewSequence.prototype.getIndex = function getIndex() {
        return this.index;
    };

    /**
     * Return printable version of this ViewSequence node.
     *
     * @method toString
     * @return {string} this index as a string
     */
    ViewSequence.prototype.toString = function toString() {
        return '' + this.index;
    };

    /**
     * Add one or more objects to the beginning of the sequence.
     *
     * @method unshift
     * @param {...Object} value arguments array of objects
     */
    ViewSequence.prototype.unshift = function unshift(value) {
        this._.array.unshift.apply(this._.array, arguments);
        this._.firstIndex -= arguments.length;
        if (this._.trackSize) this._.sizeDirty = true;
    };

    /**
     * Add one or more objects to the end of the sequence.
     *
     * @method push
     * @param {...Object} value arguments array of objects
     */
    ViewSequence.prototype.push = function push(value) {
        this._.array.push.apply(this._.array, arguments);
        if (this._.trackSize) this._.sizeDirty = true;
    };

    /**
     * Remove objects from the sequence
     *
     * @method splice
     * @param {Number} index starting index for removal
     * @param {Number} howMany how many elements to remove
     * @param {...Object} value arguments array of objects
     */
    ViewSequence.prototype.splice = function splice(index, howMany) {
        var values = Array.prototype.slice.call(arguments, 2);
        this._.array.splice.apply(this._.array, [index - this._.firstIndex, howMany].concat(values));
        this._.reindex(index, howMany, values.length);
    };

    /**
     * Exchange this element's sequence position with another's.
     *
     * @method swap
     * @param {ViewSequence} other element to swap with.
     */
    ViewSequence.prototype.swap = function swap(other) {
        var otherValue = other.get();
        var myValue = this.get();
        this._.setValue(this.index, otherValue);
        this._.setValue(other.index, myValue);

        var myPrevious = this._previousNode;
        var myNext = this._nextNode;
        var myIndex = this.index;
        var otherPrevious = other._previousNode;
        var otherNext = other._nextNode;
        var otherIndex = other.index;

        this.index = otherIndex;
        this._previousNode = (otherPrevious === this) ? other : otherPrevious;
        if (this._previousNode) this._previousNode._nextNode = this;
        this._nextNode = (otherNext === this) ? other : otherNext;
        if (this._nextNode) this._nextNode._previousNode = this;

        other.index = myIndex;
        other._previousNode = (myPrevious === other) ? this : myPrevious;
        if (other._previousNode) other._previousNode._nextNode = other;
        other._nextNode = (myNext === other) ? this : myNext;
        if (other._nextNode) other._nextNode._previousNode = other;

        if (this.index === this._.firstIndex) this._.firstNode = this;
        else if (this.index === this._.firstIndex + this._.array.length - 1) this._.lastNode = this;
        if (other.index === this._.firstIndex) this._.firstNode = other;
        else if (other.index === this._.firstIndex + this._.array.length - 1) this._.lastNode = other;
        if (this._.trackSize) this._.sizeDirty = true;
    };

   /**
     * Return value of this ViewSequence node.
     *
     * @method get
     * @return {Object} value of thiss
     */
    ViewSequence.prototype.get = function get() {
        return this._.getValue(this.index);
    };

   /**
     * Call getSize() on the contained View.
     *
     * @method getSize
     * @return {Array.Number} [width, height]
     */
    ViewSequence.prototype.getSize = function getSize() {
        var target = this.get();
        return target ? target.getSize() : null;
    };

    /**
     * Generate a render spec from the contents of this component.
     * Specifically, this will render the value at the current index.
     * @private
     * @method render
     * @return {number} Render spec for this component
     */
    ViewSequence.prototype.render = function render() {
        if (this._.trackSize && this._.sizeDirty) this._.calculateSize();
        var target = this.get();
        return target ? target.render.apply(target, arguments) : null;
    };

    module.exports = ViewSequence;
});

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: mark@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define('famous/core/Group',['require','exports','module','./Context','./Transform','./Surface'],function(require, exports, module) {
    var Context = require('./Context');
    var Transform = require('./Transform');
    var Surface = require('./Surface');

    /**
     * A Context designed to contain surfaces and set properties
     *   to be applied to all of them at once.
     *   This is primarily used for specific performance improvements in the rendering engine.
     *   Private.
     *
     * @private
     * @class Group
     * @extends Surface
     * @constructor
     * @param {Object} [options] Surface options array (see Surface})
     */
    function Group(options) {
        Surface.call(this, options);
        this._shouldRecalculateSize = false;
        this._container = document.createDocumentFragment();
        this.context = new Context(this._container);
        this.setContent(this._container);
        this._groupSize = [undefined, undefined];
    }

    /** @const */
    Group.SIZE_ZERO = [0, 0];

    Group.prototype = Object.create(Surface.prototype);
    Group.prototype.elementType = 'div';
    Group.prototype.elementClass = 'famous-group';

    /**
     * Add renderables to this component's render tree.
     *
     * @method add
     * @private
     * @param {Object} obj renderable object
     * @return {RenderNode} Render wrapping provided object, if not already a RenderNode
     */
    Group.prototype.add = function add() {
        return this.context.add.apply(this.context, arguments);
    };

    /**
     * Generate a render spec from the contents of this component.
     *
     * @private
     * @method render
     * @return {Number} Render spec for this component
     */
    Group.prototype.render = function render() {
        return Surface.prototype.render.call(this);
    };

    /**
     * Place the document element this component manages into the document.
     *
     * @private
     * @method deploy
     * @param {Node} target document parent of this container
     */
    Group.prototype.deploy = function deploy(target) {
        this.context.migrate(target);
    };

    /**
     * Remove this component and contained content from the document
     *
     * @private
     * @method recall
     *
     * @param {Node} target node to which the component was deployed
     */
    Group.prototype.recall = function recall(target) {
        this._container = document.createDocumentFragment();
        this.context.migrate(this._container);
    };

    /**
     * Apply changes from this component to the corresponding document element.
     *
     * @private
     * @method commit
     *
     * @param {Object} context update spec passed in from above in the render tree.
     */
    Group.prototype.commit = function commit(context) {
        var transform = context.transform;
        var origin = context.origin;
        var opacity = context.opacity;
        var size = context.size;
        var result = Surface.prototype.commit.call(this, {
            allocator: context.allocator,
            transform: Transform.thenMove(transform, [-origin[0] * size[0], -origin[1] * size[1], 0]),
            opacity: opacity,
            origin: origin,
            size: Group.SIZE_ZERO
        });
        if (size[0] !== this._groupSize[0] || size[1] !== this._groupSize[1]) {
            this._groupSize[0] = size[0];
            this._groupSize[1] = size[1];
            this.context.setSize(size);
        }
        this.context.update({
            transform: Transform.translate(-origin[0] * size[0], -origin[1] * size[1], 0),
            origin: origin,
            size: size
        });
        return result;
    };

    module.exports = Group;
});

define('famous/views/Scroller',['require','exports','module','../core/Entity','../core/Group','../core/OptionsManager','../core/Transform','../utilities/Utility','../core/ViewSequence','../core/EventHandler'],function(require, exports, module) {
    var Entity = require('../core/Entity');
    var Group = require('../core/Group');
    var OptionsManager = require('../core/OptionsManager');
    var Transform = require('../core/Transform');
    var Utility = require('../utilities/Utility');
    var ViewSequence = require('../core/ViewSequence');
    var EventHandler = require('../core/EventHandler');

    /**
     * Scroller lays out a collection of renderables, and will browse through them based on
     * accessed position. Scroller also broadcasts an 'edgeHit' event, with a position property of the location of the edge,
     * when you've hit the 'edges' of it's renderable collection.
     * @class Scroller
     * @constructor
      * @event error
     * @param {Options} [options] An object of configurable options.
     * @param {Number} [options.direction=Utility.Direction.Y] Using the direction helper found in the famous Utility
     * module, this option will lay out the Scroller instance's renderables either horizontally
     * (x) or vertically (y). Utility's direction is essentially either zero (X) or one (Y), so feel free
     * to just use integers as well.
     * @param {Number} [clipSize=undefined] The size of the area (in pixels) that Scroller will display content in.
     * @param {Number} [margin=undefined] The size of the area (in pixels) that Scroller will process renderables' associated calculations in.
     */
    function Scroller(options) {
        this.options = Object.create(this.constructor.DEFAULT_OPTIONS);
        this._optionsManager = new OptionsManager(this.options);
        if (options) this._optionsManager.setOptions(options);

        this._node = null;
        this._position = 0;

        // used for shifting nodes
        this._positionOffset = 0;

        this._positionGetter = null;
        this._outputFunction = null;
        this._masterOutputFunction = null;
        this.outputFrom();

        this._onEdge = 0; // -1 for top, 1 for bottom

        this.group = new Group();
        this.group.add({render: _innerRender.bind(this)});

        this._entityId = Entity.register(this);
        this._size = [undefined, undefined];
        this._contextSize = [undefined, undefined];

        this._eventInput = new EventHandler();
        this._eventOutput = new EventHandler();

        EventHandler.setInputHandler(this, this._eventInput);
        EventHandler.setOutputHandler(this, this._eventOutput);
    }

    Scroller.DEFAULT_OPTIONS = {
        direction: Utility.Direction.Y,
        margin: 0,
        clipSize: undefined,
        groupScroll: false
    };

    var EDGE_TOLERANCE = 0; //slop for detecting passing the edge

    function _sizeForDir(size) {
        if (!size) size = this._contextSize;
        var dimension = this.options.direction;
        return (size[dimension] === undefined) ? this._contextSize[dimension] : size[dimension];
    }

    function _output(node, offset, target) {
        var size = node.getSize ? node.getSize() : this._contextSize;
        var transform = this._outputFunction(offset);
        target.push({transform: transform, target: node.render()});
        return _sizeForDir.call(this, size);
    }

    function _getClipSize() {
        if (this.options.clipSize !== undefined) return this.options.clipSize;
        if (this._contextSize[this.options.direction] > this.getCumulativeSize()[this.options.direction]) {
            return _sizeForDir.call(this, this.getCumulativeSize());
        } else {
            return _sizeForDir.call(this, this._contextSize);
        }
    }

    /**
    * Returns the cumulative size of the renderables in the view sequence
    * @method getCumulativeSize
    * @return {array} a two value array of the view sequence's cumulative size up to the index.
    */
    Scroller.prototype.getCumulativeSize = function(index) {
        if (index === undefined) index = this._node._.cumulativeSizes.length - 1;
        return this._node._.getSize(index);
    };

    /**
     * Patches the Scroller instance's options with the passed-in ones.
     * @method setOptions
     * @param {Options} options An object of configurable options for the Scroller instance.
     */
    Scroller.prototype.setOptions = function setOptions(options) {
        if (options.groupScroll !== this.options.groupScroll) {
            if (options.groupScroll)
                this.group.pipe(this._eventOutput);
            else
                this.group.unpipe(this._eventOutput);
        }
        this._optionsManager.setOptions(options);
    };

    /**
     * Tells you if the Scroller instance is on an edge.
     * @method onEdge
     * @return {Boolean} Whether the Scroller instance is on an edge or not.
     */
    Scroller.prototype.onEdge = function onEdge() {
        return this._onEdge;
    };

    /**
     * Allows you to overwrite the way Scroller lays out it's renderables. Scroller will
     * pass an offset into the function. By default the Scroller instance just translates each node
     * in it's direction by the passed-in offset.
     * Scroller will translate each renderable down
     * @method outputFrom
     * @param {Function} fn A function that takes an offset and returns a transform.
     * @param {Function} [masterFn]
     */
    Scroller.prototype.outputFrom = function outputFrom(fn, masterFn) {
        if (!fn) {
            fn = function(offset) {
                return (this.options.direction === Utility.Direction.X) ? Transform.translate(offset, 0) : Transform.translate(0, offset);
            }.bind(this);
            if (!masterFn) masterFn = fn;
        }
        this._outputFunction = fn;
        this._masterOutputFunction = masterFn ? masterFn : function(offset) {
            return Transform.inverse(fn(-offset));
        };
    };

    /**
     * The Scroller instance's method for reading from an external position. Scroller uses
     * the external position to actually scroll through it's renderables.
     * @method positionFrom
     * @param {Getter} position Can be either a function that returns a position,
     * or an object with a get method that returns a position.
     */
    Scroller.prototype.positionFrom = function positionFrom(position) {
        if (position instanceof Function) this._positionGetter = position;
        else if (position && position.get) this._positionGetter = position.get.bind(position);
        else {
            this._positionGetter = null;
            this._position = position;
        }
        if (this._positionGetter) this._position = this._positionGetter.call(this);
    };

    /**
     * Sets the collection of renderables under the Scroller instance's control.
     *
     * @method sequenceFrom
     * @param node {Array|ViewSequence} Either an array of renderables or a Famous viewSequence.
     * @chainable
     */
    Scroller.prototype.sequenceFrom = function sequenceFrom(node) {
        if (node instanceof Array) node = new ViewSequence({array: node});
        this._node = node;
        this._positionOffset = 0;
    };

    /**
     * Returns the width and the height of the Scroller instance.
     *
     * @method getSize
     * @return {Array} A two value array of the Scroller instance's current width and height (in that order).
     */
    Scroller.prototype.getSize = function getSize(actual) {
        return actual ? this._contextSize : this._size;
    };

    /**
     * Generate a render spec from the contents of this component.
     *
     * @private
     * @method render
     * @return {number} Render spec for this component
     */
    Scroller.prototype.render = function render() {
        if (!this._node) return null;
        if (this._positionGetter) this._position = this._positionGetter.call(this);
        return this._entityId;
    };

    /**
     * Apply changes from this component to the corresponding document element.
     * This includes changes to classes, styles, size, content, opacity, origin,
     * and matrix transforms.
     *
     * @private
     * @method commit
     * @param {Context} context commit context
     */
    Scroller.prototype.commit = function commit(context) {
        var transform = context.transform;
        var opacity = context.opacity;
        var origin = context.origin;
        var size = context.size;

        // reset edge detection on size change
        if (!this.options.clipSize && (size[0] !== this._contextSize[0] || size[1] !== this._contextSize[1])) {
            this._onEdge = 0;
            this._contextSize[0] = size[0];
            this._contextSize[1] = size[1];

            if (this.options.direction === Utility.Direction.X) {
                this._size[0] = _getClipSize.call(this);
                this._size[1] = undefined;
            }
            else {
                this._size[0] = undefined;
                this._size[1] = _getClipSize.call(this);
            }
        }

        var scrollTransform = this._masterOutputFunction(-this._position);

        return {
            transform: Transform.multiply(transform, scrollTransform),
            size: size,
            opacity: opacity,
            origin: origin,
            target: this.group.render()
        };
    };

    function _innerRender() {
        var size = null;
        var position = this._position;
        var result = [];

        var offset = -this._positionOffset;
        var clipSize = _getClipSize.call(this);
        var currNode = this._node;
        while (currNode && offset - position < clipSize + this.options.margin) {
            offset += _output.call(this, currNode, offset, result);
            currNode = currNode.getNext ? currNode.getNext() : null;
        }

        var sizeNode = this._node;
        var nodesSize = _sizeForDir.call(this, sizeNode.getSize());
        if (offset < clipSize) {
            while (sizeNode && nodesSize < clipSize) {
                sizeNode = sizeNode.getPrevious();
                if (sizeNode) nodesSize += _sizeForDir.call(this, sizeNode.getSize());
            }
            sizeNode = this._node;
            while (sizeNode && nodesSize < clipSize) {
                sizeNode = sizeNode.getNext();
                if (sizeNode) nodesSize += _sizeForDir.call(this, sizeNode.getSize());
            }
        }

        if (!currNode && offset - position < clipSize - EDGE_TOLERANCE) {
            if (this._onEdge !== 1){
                this._onEdge = 1;
                this._eventOutput.emit('onEdge', {
                    position: offset - clipSize
                });
            }
        }
        else if (!this._node.getPrevious() && position < -EDGE_TOLERANCE) {
            if (this._onEdge !== -1) {
                this._onEdge = -1;
                this._eventOutput.emit('onEdge', {
                    position: 0
                });
            }
        }
        else {
            if (this._onEdge !== 0){
                this._onEdge = 0;
                this._eventOutput.emit('offEdge');
            }
        }

        // backwards
        currNode = (this._node && this._node.getPrevious) ? this._node.getPrevious() : null;
        offset = -this._positionOffset;
        if (currNode) {
            size = currNode.getSize ? currNode.getSize() : this._contextSize;
            offset -= _sizeForDir.call(this, size);
        }

        while (currNode && ((offset - position) > -(clipSize + this.options.margin))) {
            _output.call(this, currNode, offset, result);
            currNode = currNode.getPrevious ? currNode.getPrevious() : null;
            if (currNode) {
                size = currNode.getSize ? currNode.getSize() : this._contextSize;
                offset -= _sizeForDir.call(this, size);
            }
        }

        return result;
    }

    module.exports = Scroller;
});

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: mark@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */
define('famous/inputs/ScrollSync',['require','exports','module','../core/EventHandler','../core/Engine','../core/OptionsManager'],function(require, exports, module) {
    var EventHandler = require('../core/EventHandler');
    var Engine = require('../core/Engine');
    var OptionsManager = require('../core/OptionsManager');

    /**
     * Handles piped in mousewheel events.
     *   Emits 'start', 'update', and 'end' events with payloads including:
     *   delta: change since last position,
     *   position: accumulated deltas,
     *   velocity: speed of change in pixels per ms,
     *   slip: true (unused).
     *
     *   Can be used as delegate of GenericSync.
     *
     * @class ScrollSync
     * @constructor
     * @param {Object} [options] overrides of default options
     * @param {Number} [options.direction] Pay attention to x changes (ScrollSync.DIRECTION_X),
     *   y changes (ScrollSync.DIRECTION_Y) or both (undefined)
     * @param {Number} [options.minimumEndSpeed] End speed calculation floors at this number, in pixels per ms
     * @param {boolean} [options.rails] whether to snap position calculations to nearest axis
     * @param {Number | Array.Number} [options.scale] scale outputs in by scalar or pair of scalars
     * @param {Number} [options.stallTime] reset time for velocity calculation in ms
     */
    function ScrollSync(options) {
        this.options = Object.create(ScrollSync.DEFAULT_OPTIONS);
        this._optionsManager = new OptionsManager(this.options);
        if (options) this.setOptions(options);

        this._payload = {
            delta    : null,
            position : null,
            velocity : null,
            slip     : true
        };

        this._eventInput = new EventHandler();
        this._eventOutput = new EventHandler();

        EventHandler.setInputHandler(this, this._eventInput);
        EventHandler.setOutputHandler(this, this._eventOutput);

        this._position = (this.options.direction === undefined) ? [0,0] : 0;
        this._prevTime = undefined;
        this._prevVel = undefined;
        this._eventInput.on('mousewheel', _handleMove.bind(this));
        this._eventInput.on('wheel', _handleMove.bind(this));
        this._inProgress = false;
        this._loopBound = false;
    }

    ScrollSync.DEFAULT_OPTIONS = {
        direction: undefined,
        minimumEndSpeed: Infinity,
        rails: false,
        scale: 1,
        stallTime: 50,
        lineHeight: 40,
        preventDefault: true
    };

    ScrollSync.DIRECTION_X = 0;
    ScrollSync.DIRECTION_Y = 1;

    var MINIMUM_TICK_TIME = 8;

    var _now = Date.now;

    function _newFrame() {
        if (this._inProgress && (_now() - this._prevTime) > this.options.stallTime) {
            this._inProgress = false;

            var finalVel = (Math.abs(this._prevVel) >= this.options.minimumEndSpeed)
                ? this._prevVel
                : 0;

            var payload = this._payload;
            payload.position = this._position;
            payload.velocity = finalVel;
            payload.slip = true;

            this._eventOutput.emit('end', payload);
        }
    }

    function _handleMove(event) {
        if (this.options.preventDefault) event.preventDefault();

        if (!this._inProgress) {
            this._inProgress = true;
            this._position = (this.options.direction === undefined) ? [0,0] : 0;
            payload = this._payload;
            payload.slip = true;
            payload.position = this._position;
            payload.clientX = event.clientX;
            payload.clientY = event.clientY;
            payload.offsetX = event.offsetX;
            payload.offsetY = event.offsetY;
            this._eventOutput.emit('start', payload);
            if (!this._loopBound) {
                Engine.on('prerender', _newFrame.bind(this));
                this._loopBound = true;
            }
        }

        var currTime = _now();
        var prevTime = this._prevTime || currTime;

        var diffX = (event.wheelDeltaX !== undefined) ? event.wheelDeltaX : -event.deltaX;
        var diffY = (event.wheelDeltaY !== undefined) ? event.wheelDeltaY : -event.deltaY;

        if (event.deltaMode === 1) { // units in lines, not pixels
            diffX *= this.options.lineHeight;
            diffY *= this.options.lineHeight;
        }

        if (this.options.rails) {
            if (Math.abs(diffX) > Math.abs(diffY)) diffY = 0;
            else diffX = 0;
        }

        var diffTime = Math.max(currTime - prevTime, MINIMUM_TICK_TIME); // minimum tick time

        var velX = diffX / diffTime;
        var velY = diffY / diffTime;

        var scale = this.options.scale;
        var nextVel;
        var nextDelta;

        if (this.options.direction === ScrollSync.DIRECTION_X) {
            nextDelta = scale * diffX;
            nextVel = scale * velX;
            this._position += nextDelta;
        }
        else if (this.options.direction === ScrollSync.DIRECTION_Y) {
            nextDelta = scale * diffY;
            nextVel = scale * velY;
            this._position += nextDelta;
        }
        else {
            nextDelta = [scale * diffX, scale * diffY];
            nextVel = [scale * velX, scale * velY];
            this._position[0] += nextDelta[0];
            this._position[1] += nextDelta[1];
        }

        var payload = this._payload;
        payload.delta    = nextDelta;
        payload.velocity = nextVel;
        payload.position = this._position;
        payload.slip     = true;

        this._eventOutput.emit('update', payload);

        this._prevTime = currTime;
        this._prevVel = nextVel;
    }

    /**
     * Return entire options dictionary, including defaults.
     *
     * @method getOptions
     * @return {Object} configuration options
     */
    ScrollSync.prototype.getOptions = function getOptions() {
        return this.options;
    };

    /**
     * Set internal options, overriding any default options
     *
     * @method setOptions
     *
     * @param {Object} [options] overrides of default options
     * @param {Number} [options.minimimEndSpeed] If final velocity smaller than this, round down to 0.
     * @param {Number} [options.stallTime] ms of non-motion before 'end' emitted
     * @param {Number} [options.rails] whether to constrain to nearest axis.
     * @param {Number} [options.direction] ScrollSync.DIRECTION_X, DIRECTION_Y -
     *    pay attention to one specific direction.
     * @param {Number} [options.scale] constant factor to scale velocity output
     */
    ScrollSync.prototype.setOptions = function setOptions(options) {
        return this._optionsManager.setOptions(options);
    };

    module.exports = ScrollSync;
});

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: mark@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */
define('famous/inputs/TouchTracker',['require','exports','module','../core/EventHandler'],function(require, exports, module) {
    var EventHandler = require('../core/EventHandler');

    var _now = Date.now;

    function _timestampTouch(touch, event, history) {
        return {
            x: touch.clientX,
            y: touch.clientY,
            identifier : touch.identifier,
            origin: event.origin,
            timestamp: _now(),
            count: event.touches.length,
            history: history
        };
    }

    function _handleStart(event) {
        if (event.touches.length > this.touchLimit) return;
        this.isTouched = true;

        for (var i = 0; i < event.changedTouches.length; i++) {
            var touch = event.changedTouches[i];
            var data = _timestampTouch(touch, event, null);
            this.eventOutput.emit('trackstart', data);
            if (!this.selective && !this.touchHistory[touch.identifier]) this.track(data);
        }
    }

    function _handleMove(event) {
        if (event.touches.length > this.touchLimit) return;

        for (var i = 0; i < event.changedTouches.length; i++) {
            var touch = event.changedTouches[i];
            var history = this.touchHistory[touch.identifier];
            if (history) {
                var data = _timestampTouch(touch, event, history);
                this.touchHistory[touch.identifier].push(data);
                this.eventOutput.emit('trackmove', data);
            }
        }
    }

    function _handleEnd(event) {
        if (!this.isTouched) return;

        for (var i = 0; i < event.changedTouches.length; i++) {
            var touch = event.changedTouches[i];
            var history = this.touchHistory[touch.identifier];
            if (history) {
                var data = _timestampTouch(touch, event, history);
                this.touchHistory[touch.identifier].push(data);
                this.eventOutput.emit('trackend', data);
                delete this.touchHistory[touch.identifier];
            }
        }

        this.isTouched = false;
    }

    function _handleUnpipe() {
        for (var i in this.touchHistory) {
            var history = this.touchHistory[i];
            this.eventOutput.emit('trackend', {
                touch: history[history.length - 1].touch,
                timestamp: Date.now(),
                count: 0,
                history: history
            });
            delete this.touchHistory[i];
        }
    }

    /**
     * Helper to TouchSync – tracks piped in touch events, organizes touch
     *   events by ID, and emits track events back to TouchSync.
     *   Emits 'trackstart', 'trackmove', and 'trackend' events upstream.
     *
     * @class TouchTracker
     * @constructor
     * @param {Object} options default options overrides
     * @param [options.selective] {Boolean} selective if false, saves state for each touch
     * @param [options.touchLimit] {Number} touchLimit upper bound for emitting events based on number of touches
     */
    function TouchTracker(options) {
        this.selective = options.selective;
        this.touchLimit = options.touchLimit || 1;

        this.touchHistory = {};

        this.eventInput = new EventHandler();
        this.eventOutput = new EventHandler();

        EventHandler.setInputHandler(this, this.eventInput);
        EventHandler.setOutputHandler(this, this.eventOutput);

        this.eventInput.on('touchstart', _handleStart.bind(this));
        this.eventInput.on('touchmove', _handleMove.bind(this));
        this.eventInput.on('touchend', _handleEnd.bind(this));
        this.eventInput.on('touchcancel', _handleEnd.bind(this));
        this.eventInput.on('unpipe', _handleUnpipe.bind(this));

        this.isTouched = false;
    }

    /**
     * Record touch data, if selective is false.
     * @private
     * @method track
     * @param {Object} data touch data
     */
    TouchTracker.prototype.track = function track(data) {
        this.touchHistory[data.identifier] = [data];
    };

    module.exports = TouchTracker;
});

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: mark@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */
define('famous/inputs/TouchSync',['require','exports','module','./TouchTracker','../core/EventHandler','../core/OptionsManager','./SyncUtils'],function(require, exports, module) {
    var TouchTracker = require('./TouchTracker');
    var EventHandler = require('../core/EventHandler');
    var OptionsManager = require('../core/OptionsManager');
    var SyncUtils = require('./SyncUtils');

    /**
     * Handles piped in touch events. Emits 'start', 'update', and 'events'
     *   events with delta, position, velocity, acceleration, clientX, clientY, count, and touch id.
     *   Useful for dealing with inputs on touch devices. Designed to be used either as standalone, or
     *   included in a GenericSync.
     *
     * @class TouchSync
     * @constructor
     *
     * @example
     *   var Surface = require('../core/Surface');
     *   var TouchSync = require('../inputs/TouchSync');
     *
     *   var surface = new Surface({ size: [100, 100] });
     *   var touchSync = new TouchSync();
     *   surface.pipe(touchSync);
     *
     *   touchSync.on('start', function (e) { // react to start });
     *   touchSync.on('update', function (e) { // react to update });
     *   touchSync.on('end', function (e) { // react to end });*
     *
     * @param [options] {Object}             default options overrides
     * @param [options.direction] {Number}   read from a particular axis
     * @param [options.rails] {Boolean}      read from axis with greatest differential
     * @param [options.velocitySampleLength] {Number}  Number of previous frames to check velocity against.
     * @param [options.scale] {Number}       constant factor to scale velocity output
     * @param [options.touchLimit] {Number}  touchLimit upper bound for emitting events based on number of touches
     */
    function TouchSync(options) {
        this.options =  Object.create(TouchSync.DEFAULT_OPTIONS);
        this._optionsManager = new OptionsManager(this.options);
        if (options) this.setOptions(options);

        this._eventOutput = new EventHandler();
        this._touchTracker = new TouchTracker({
            touchLimit: this.options.touchLimit
        });

        EventHandler.setOutputHandler(this, this._eventOutput);
        EventHandler.setInputHandler(this, this._touchTracker);

        this._touchTracker.on('trackstart', _handleStart.bind(this));
        this._touchTracker.on('trackmove', _handleMove.bind(this));
        this._touchTracker.on('trackend', _handleEnd.bind(this));

        this._payload = {
            delta    : null,
            position : null,
            velocity : null,
            clientX  : undefined,
            clientY  : undefined,
            count    : 0,
            touch    : undefined
        };

        this._position = null; // to be deprecated
    }

    TouchSync.DEFAULT_OPTIONS = {
        direction: undefined,
        rails: false,
        touchLimit: 1,
        velocitySampleLength: 10,
        scale: 1,
        timeSampleDuration: 400
    };

    TouchSync.DIRECTION_X = 0;
    TouchSync.DIRECTION_Y = 1;

    var MINIMUM_TICK_TIME = 8;

    /**
     *  Triggered by trackstart.
     *  @method _handleStart
     *  @private
     */
    function _handleStart(data) {
        var velocity;
        var delta;
        if (this.options.direction !== undefined){
            this._position = 0;
            velocity = 0;
            delta = 0;
        }
        else {
            this._position = [0, 0];
            velocity = [0, 0];
            delta = [0, 0];
        }

        var payload = this._payload;
        payload.delta = delta;
        payload.position = this._position;
        payload.velocity = velocity;
        payload.clientX = data.x;
        payload.clientY = data.y;
        payload.count = data.count;
        payload.touch = data.identifier;

        this._eventOutput.emit('start', payload);
    }

    /**
     *  Triggered by trackmove.
     *  @method _handleMove
     *  @private
     */
    function _handleMove(data) {
        calculatePayload.call(this, data);
    }

    function calculatePayload (data) {
        var history = data.history;

        var currHistory = history[history.length - 1];

        var distantHistory = SyncUtils.getTimeHistoryPosition(history, this.options.timeSampleDuration);

        var distantTime = distantHistory.timestamp;
        var currTime = currHistory.timestamp;

        var diffX = currHistory.x - distantHistory.x;
        var diffY = currHistory.y - distantHistory.y;

        var velDiffX = currHistory.x - distantTime;
        var velDiffY = currHistory.y - distantTime;

        if (this.options.rails) {
            if (Math.abs(diffX) > Math.abs(diffY)) diffY = 0;
            else diffX = 0;

            if (Math.abs(velDiffX) > Math.abs(velDiffY)) velDiffY = 0;
            else velDiffX = 0;
        }

        var diffTime = Math.max(currTime - distantTime, MINIMUM_TICK_TIME);

        var velX = velDiffX / diffTime;
        var velY = velDiffY / diffTime;

        var scale = this.options.scale;
        var nextVel;
        var nextDelta;

        if (this.options.direction === TouchSync.DIRECTION_X) {
            nextDelta = scale * diffX;
            nextVel = scale * velX;
            this._position += nextDelta;
        }
        else if (this.options.direction === TouchSync.DIRECTION_Y) {
            nextDelta = scale * diffY;
            nextVel = scale * velY;
            this._position += nextDelta;
        }
        else {
            nextDelta = [scale * diffX, scale * diffY];
            nextVel = [scale * velX, scale * velY];
            this._position[0] += nextDelta[0];
            this._position[1] += nextDelta[1];
        }

        var payload = this._payload;
        payload.delta    = nextDelta;
        payload.velocity = nextVel;
        payload.position = this._position;
        payload.clientX  = data.x;
        payload.clientY  = data.y;
        payload.count    = data.count;
        payload.touch    = data.identifier;

        this._eventOutput.emit('update', payload);
    }

    /**
     *  Triggered by trackend.
     *  @method _handleEnd
     *  @private
     */
    function _handleEnd(data) {
        calculatePayload.call(this, data);
        this._payload.count = data.count;
        this._eventOutput.emit('end', this._payload);
    }

    /**
     * Set internal options, overriding any default options
     *
     * @method setOptions
     *
     * @param [options] {Object}             default options overrides
     * @param [options.direction] {Number}   read from a particular axis
     * @param [options.rails] {Boolean}      read from axis with greatest differential
     * @param [options.scale] {Number}       constant factor to scale velocity output
     */
    TouchSync.prototype.setOptions = function setOptions(options) {
        return this._optionsManager.setOptions(options);
    };

    /**
     * Return entire options dictionary, including defaults.
     *
     * @method getOptions
     * @return {Object} configuration options
     */
    TouchSync.prototype.getOptions = function getOptions() {
        return this.options;
    };

    module.exports = TouchSync;
});

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: felix@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define('famous/views/Scrollview',['require','exports','module','../physics/PhysicsEngine','../physics/bodies/Particle','../physics/forces/Drag','../physics/forces/Spring','../core/EventHandler','../core/OptionsManager','../core/ViewSequence','../views/Scroller','../utilities/Utility','../inputs/GenericSync','../inputs/ScrollSync','../inputs/TouchSync'],function(require, exports, module) {
    var PhysicsEngine = require('../physics/PhysicsEngine');
    var Particle = require('../physics/bodies/Particle');
    var Drag = require('../physics/forces/Drag');
    var Spring = require('../physics/forces/Spring');

    var EventHandler = require('../core/EventHandler');
    var OptionsManager = require('../core/OptionsManager');
    var ViewSequence = require('../core/ViewSequence');
    var Scroller = require('../views/Scroller');
    var Utility = require('../utilities/Utility');

    var GenericSync = require('../inputs/GenericSync');
    var ScrollSync = require('../inputs/ScrollSync');
    var TouchSync = require('../inputs/TouchSync');
    GenericSync.register({scroll : ScrollSync, touch : TouchSync});

    /** @const */
    var TOLERANCE = 0.5;

    /** @enum */
    var SpringStates = {
        NONE: 0,
        EDGE: 1,
        PAGE: 2
    };

    /** @enum */
    var EdgeStates = {
        TOP:   -1,
        NONE:   0,
        BOTTOM: 1
    };

    /**
     * Scrollview will lay out a collection of renderables sequentially in the specified direction, and will
     * allow you to scroll through them with mousewheel or touch events.
     * @class Scrollview
     * @constructor
     * @param {Options} [options] An object of configurable options.
     * @param {Number} [options.direction=Utility.Direction.Y] Using the direction helper found in the famous Utility
     * module, this option will lay out the Scrollview instance's renderables either horizontally
     * (x) or vertically (y). Utility's direction is essentially either zero (X) or one (Y), so feel free
     * to just use integers as well.
     * @param {Boolean} [options.rails=true] When true, Scrollview's genericSync will only process input in it's primary access.
     * @param {Number} [clipSize=undefined] The size of the area (in pixels) that Scrollview will display content in.
     * @param {Number} [margin=undefined] The size of the area (in pixels) that Scrollview will process renderables' associated calculations in.
     * @param {Number} [friction=0.001] Input resistance proportional to the velocity of the input.
     * Controls the feel of the Scrollview instance at low velocities.
     * @param {Number} [drag=0.0001] Input resistance proportional to the square of the velocity of the input.
     * Affects Scrollview instance more prominently at high velocities.
     * @param {Number} [edgeGrip=0.5] A coefficient for resistance against after-touch momentum.
     * @param {Number} [egePeriod=300] Sets the period on the spring that handles the physics associated
     * with hitting the end of a scrollview.
     * @param {Number} [edgeDamp=1] Sets the damping on the spring that handles the physics associated
     * with hitting the end of a scrollview.
     * @param {Boolean} [paginated=false] A paginated scrollview will scroll through items discretely
     * rather than continously.
     * @param {Number} [pagePeriod=500] Sets the period on the spring that handles the physics associated
     * with pagination.
     * @param {Number} [pageDamp=0.8] Sets the damping on the spring that handles the physics associated
     * with pagination.
     * @param {Number} [pageStopSpeed=Infinity] The threshold for determining the amount of velocity
     * required to trigger pagination. The lower the threshold, the easier it is to scroll continuosly.
     * @param {Number} [pageSwitchSpeed=1] The threshold for momentum-based velocity pagination.
     * @param {Number} [speedLimit=10] The highest scrolling speed you can reach.
     */
    function Scrollview(options) {
        // patch options with defaults
        this.options = Object.create(Scrollview.DEFAULT_OPTIONS);
        this._optionsManager = new OptionsManager(this.options);

        // create sub-components
        this._scroller = new Scroller(this.options);

        this.sync = new GenericSync(
            ['scroll', 'touch'],
            {
                direction : this.options.direction,
                scale : this.options.syncScale,
                rails: this.options.rails,
                preventDefault: this.options.preventDefault !== undefined
                    ? this.options.preventDefault
                    : this.options.direction !== Utility.Direction.Y
            }
        );

        this._physicsEngine = new PhysicsEngine();
        this._particle = new Particle();
        this._physicsEngine.addBody(this._particle);

        this.spring = new Spring({
            anchor: [0, 0, 0],
            period: this.options.edgePeriod,
            dampingRatio: this.options.edgeDamp
        });
        this.drag = new Drag({
            forceFunction: Drag.FORCE_FUNCTIONS.QUADRATIC,
            strength: this.options.drag
        });
        this.friction = new Drag({
            forceFunction: Drag.FORCE_FUNCTIONS.LINEAR,
            strength: this.options.friction
        });

        // state
        this._node = null;
        this._touchCount = 0;
        this._springState = SpringStates.NONE;
        this._onEdge = EdgeStates.NONE;
        this._pageSpringPosition = 0;
        this._edgeSpringPosition = 0;
        this._touchVelocity = 0;
        this._earlyEnd = false;
        this._needsPaginationCheck = false;
        this._displacement = 0;
        this._totalShift = 0;
        this._cachedIndex = 0;

        // subcomponent logic
        this._scroller.positionFrom(this.getPosition.bind(this));

        // eventing
        this._eventInput = new EventHandler();
        this._eventOutput = new EventHandler();

        this._eventInput.pipe(this.sync);
        this.sync.pipe(this._eventInput);

        EventHandler.setInputHandler(this, this._eventInput);
        EventHandler.setOutputHandler(this, this._eventOutput);

        _bindEvents.call(this);

        // override default options with passed-in custom options
        if (options) this.setOptions(options);
    }

    Scrollview.DEFAULT_OPTIONS = {
        direction: Utility.Direction.Y,
        rails: true,
        friction: 0.005,
        drag: 0.0001,
        edgeGrip: 0.2,
        edgePeriod: 300,
        edgeDamp: 1,
        margin: 1000,       // mostly safe
        paginated: false,
        pagePeriod: 500,
        pageDamp: 0.8,
        pageStopSpeed: 10,
        pageSwitchSpeed: 0.5,
        speedLimit: 5,
        groupScroll: false,
        syncScale: 1
    };

    function _handleStart(event) {
        this._touchCount = event.count;
        if (event.count === undefined) this._touchCount = 1;

        _detachAgents.call(this);

        this.setVelocity(0);
        this._touchVelocity = 0;
        this._earlyEnd = false;
    }

    function _handleMove(event) {
        var velocity = -event.velocity;
        var delta = -event.delta;

        if (this._onEdge !== EdgeStates.NONE && event.slip) {
            if ((velocity < 0 && this._onEdge === EdgeStates.TOP) || (velocity > 0 && this._onEdge === EdgeStates.BOTTOM)) {
                if (!this._earlyEnd) {
                    _handleEnd.call(this, event);
                    this._earlyEnd = true;
                }
            }
            else if (this._earlyEnd && (Math.abs(velocity) > Math.abs(this.getVelocity()))) {
                _handleStart.call(this, event);
            }
        }
        if (this._earlyEnd) return;
        this._touchVelocity = velocity;

        if (event.slip) {
            var speedLimit = this.options.speedLimit;
            if (velocity < -speedLimit) velocity = -speedLimit;
            else if (velocity > speedLimit) velocity = speedLimit;

            this.setVelocity(velocity);

            var deltaLimit = speedLimit * 16;
            if (delta > deltaLimit) delta = deltaLimit;
            else if (delta < -deltaLimit) delta = -deltaLimit;
        }

        this.setPosition(this.getPosition() + delta);
        this._displacement += delta;

        if (this._springState === SpringStates.NONE) _normalizeState.call(this);
    }

    function _handleEnd(event) {
        this._touchCount = event.count || 0;
        if (!this._touchCount) {
            _detachAgents.call(this);
            if (this._onEdge !== EdgeStates.NONE) _setSpring.call(this, this._edgeSpringPosition, SpringStates.EDGE);
            _attachAgents.call(this);
            var velocity = -event.velocity;
            var speedLimit = this.options.speedLimit;
            if (event.slip) speedLimit *= this.options.edgeGrip;
            if (velocity < -speedLimit) velocity = -speedLimit;
            else if (velocity > speedLimit) velocity = speedLimit;
            this.setVelocity(velocity);
            this._touchVelocity = 0;
            this._needsPaginationCheck = true;
        }
    }

    function _bindEvents() {
        this._eventInput.bindThis(this);
        this._eventInput.on('start', _handleStart);
        this._eventInput.on('update', _handleMove);
        this._eventInput.on('end', _handleEnd);

        this._eventInput.on('resize', function() {
            this._node._.calculateSize();
        }.bind(this));

        this._scroller.on('onEdge', function(data) {
            this._edgeSpringPosition = data.position;
            _handleEdge.call(this, this._scroller.onEdge());
            this._eventOutput.emit('onEdge');
        }.bind(this));

        this._scroller.on('offEdge', function() {
            this.sync.setOptions({scale: this.options.syncScale});
            this._onEdge = this._scroller.onEdge();
            this._eventOutput.emit('offEdge');
        }.bind(this));

        this._particle.on('update', function(particle) {
            if (this._springState === SpringStates.NONE) _normalizeState.call(this);
            this._displacement = particle.position.x - this._totalShift;
        }.bind(this));

        this._particle.on('end', function() {
            if (!this.options.paginated || (this.options.paginated && this._springState !== SpringStates.NONE))
                this._eventOutput.emit('settle');
        }.bind(this));
    }

    function _attachAgents() {
        if (this._springState) this._physicsEngine.attach([this.spring], this._particle);
        else this._physicsEngine.attach([this.drag, this.friction], this._particle);
    }

    function _detachAgents() {
        this._springState = SpringStates.NONE;
        this._physicsEngine.detachAll();
    }

    function _nodeSizeForDirection(node) {
        var direction = this.options.direction;
        var nodeSize = node.getSize();
        return (!nodeSize) ? this._scroller.getSize()[direction] : nodeSize[direction];
    }

    function _handleEdge(edge) {
        this.sync.setOptions({scale: this.options.edgeGrip});
        this._onEdge = edge;

        if (!this._touchCount && this._springState !== SpringStates.EDGE) {
            _setSpring.call(this, this._edgeSpringPosition, SpringStates.EDGE);
        }

        if (this._springState && Math.abs(this.getVelocity()) < 0.001) {
            // reset agents, detaching the spring
            _detachAgents.call(this);
            _attachAgents.call(this);
        }
    }

    function _handlePagination() {
        if (this._touchCount) return;
        if (this._springState === SpringStates.EDGE) return;

        var velocity = this.getVelocity();
        if (Math.abs(velocity) >= this.options.pageStopSpeed) return;

        var position = this.getPosition();
        var velocitySwitch = Math.abs(velocity) > this.options.pageSwitchSpeed;

        // parameters to determine when to switch
        var nodeSize = _nodeSizeForDirection.call(this, this._node);
        var positionNext = position > 0.5 * nodeSize;
        var positionPrev = position < 0.5 * nodeSize;

        var velocityNext = velocity > 0;
        var velocityPrev = velocity < 0;

        this._needsPaginationCheck = false;

        if ((positionNext && !velocitySwitch) || (velocitySwitch && velocityNext)) {
            this.goToNextPage();
        }
        else if (velocitySwitch && velocityPrev) {
            this.goToPreviousPage();
        }
        else _setSpring.call(this, 0, SpringStates.PAGE);
    }

    function _setSpring(position, springState) {
        var springOptions;
        if (springState === SpringStates.EDGE) {
            this._edgeSpringPosition = position;
            springOptions = {
                anchor: [this._edgeSpringPosition, 0, 0],
                period: this.options.edgePeriod,
                dampingRatio: this.options.edgeDamp
            };
        }
        else if (springState === SpringStates.PAGE) {
            this._pageSpringPosition = position;
            springOptions = {
                anchor: [this._pageSpringPosition, 0, 0],
                period: this.options.pagePeriod,
                dampingRatio: this.options.pageDamp
            };
        }

        this.spring.setOptions(springOptions);
        if (springState && !this._springState) {
            _detachAgents.call(this);
            this._springState = springState;
            _attachAgents.call(this);
        }
        this._springState = springState;
    }

    function _normalizeState() {
        var offset = 0;

        var position = this.getPosition();
        position += (position < 0 ? -0.5 : 0.5) >> 0;

        var nodeSize = _nodeSizeForDirection.call(this, this._node);
        var nextNode = this._node.getNext();

        while (offset + position >= nodeSize && nextNode) {
            offset -= nodeSize;
            this._scroller.sequenceFrom(nextNode);
            this._node = nextNode;
            nextNode = this._node.getNext();
            nodeSize = _nodeSizeForDirection.call(this, this._node);
        }

        var previousNode = this._node.getPrevious();
        var previousNodeSize;

        while (offset + position <= 0 && previousNode) {
            previousNodeSize = _nodeSizeForDirection.call(this, previousNode);
            this._scroller.sequenceFrom(previousNode);
            this._node = previousNode;
            offset += previousNodeSize;
            previousNode = this._node.getPrevious();
        }

        if (offset) _shiftOrigin.call(this, offset);

        if (this._node) {
            if (this._node.index !== this._cachedIndex) {
                if (this.getPosition() < 0.5 * nodeSize) {
                    this._cachedIndex = this._node.index;
                    this._eventOutput.emit('pageChange', {direction: -1, index: this._cachedIndex});
                }
            } else {
                if (this.getPosition() > 0.5 * nodeSize) {
                    this._cachedIndex = this._node.index + 1;
                    this._eventOutput.emit('pageChange', {direction: 1, index: this._cachedIndex});
                }
            }
        }
    }

    function _shiftOrigin(amount) {
        this._edgeSpringPosition += amount;
        this._pageSpringPosition += amount;
        this.setPosition(this.getPosition() + amount);
        this._totalShift += amount;

        if (this._springState === SpringStates.EDGE) {
            this.spring.setOptions({anchor: [this._edgeSpringPosition, 0, 0]});
        }
        else if (this._springState === SpringStates.PAGE) {
            this.spring.setOptions({anchor: [this._pageSpringPosition, 0, 0]});
        }
    }

    /**
     * Returns the index of the first visible renderable
     *
     * @method getCurrentIndex
     * @return {Number} The current index of the ViewSequence
     */
    Scrollview.prototype.getCurrentIndex = function getCurrentIndex() {
        return this._node.index;
    };

    /**
     * goToPreviousPage paginates your Scrollview instance backwards by one item.
     *
     * @method goToPreviousPage
     * @return {ViewSequence} The previous node.
     */
    Scrollview.prototype.goToPreviousPage = function goToPreviousPage() {
        if (!this._node || this._onEdge === EdgeStates.TOP) return null;

        // if moving back to the current node
        if (this.getPosition() > 1 && this._springState === SpringStates.NONE) {
            _setSpring.call(this, 0, SpringStates.PAGE);
            return this._node;
        }

        // if moving to the previous node
        var previousNode = this._node.getPrevious();
        if (previousNode) {
            var previousNodeSize = _nodeSizeForDirection.call(this, previousNode);
            this._scroller.sequenceFrom(previousNode);
            this._node = previousNode;
            _shiftOrigin.call(this, previousNodeSize);
            _setSpring.call(this, 0, SpringStates.PAGE);
        }
        return previousNode;
    };

    /**
     * goToNextPage paginates your Scrollview instance forwards by one item.
     *
     * @method goToNextPage
     * @return {ViewSequence} The next node.
     */
    Scrollview.prototype.goToNextPage = function goToNextPage() {
        if (!this._node || this._onEdge === EdgeStates.BOTTOM) return null;
        var nextNode = this._node.getNext();
        if (nextNode) {
            var currentNodeSize = _nodeSizeForDirection.call(this, this._node);
            this._scroller.sequenceFrom(nextNode);
            this._node = nextNode;
            _shiftOrigin.call(this, -currentNodeSize);
            _setSpring.call(this, 0, SpringStates.PAGE);
        }
        return nextNode;
    };

    /**
     * Paginates the Scrollview to an absolute page index.
     *
     * @method goToPage
     */
    Scrollview.prototype.goToPage = function goToPage(index) {
        var currentIndex = this.getCurrentIndex();
        var i;

        if (currentIndex > index) {
            for (i = 0; i < currentIndex - index; i++)
                this.goToPreviousPage();
        }

        if (currentIndex < index) {
            for (i = 0; i < index - currentIndex; i++)
                this.goToNextPage();
        }
    };

    Scrollview.prototype.outputFrom = function outputFrom() {
        return this._scroller.outputFrom.apply(this._scroller, arguments);
    };

    /**
     * Returns the position associated with the Scrollview instance's current node
     *  (generally the node currently at the top).
     *
     * @deprecated
     * @method getPosition
     * @param {number} [node] If specified, returns the position of the node at that index in the
     * Scrollview instance's currently managed collection.
     * @return {number} The position of either the specified node, or the Scrollview's current Node,
     * in pixels translated.
     */
    Scrollview.prototype.getPosition = function getPosition() {
        return this._particle.getPosition1D();
    };

    /**
     * Returns the absolute position associated with the Scrollview instance
     *
     * @method getAbsolutePosition
     * @return {number} The position of the Scrollview's current Node,
     * in pixels translated.
     */
    Scrollview.prototype.getAbsolutePosition = function getAbsolutePosition() {
        return this._scroller.getCumulativeSize(this.getCurrentIndex())[this.options.direction] + this.getPosition();
    };

    /**
     * Returns the offset associated with the Scrollview instance's current node
     *  (generally the node currently at the top).
     *
     * @method getOffset
     * @param {number} [node] If specified, returns the position of the node at that index in the
     * Scrollview instance's currently managed collection.
     * @return {number} The position of either the specified node, or the Scrollview's current Node,
     * in pixels translated.
     */
    Scrollview.prototype.getOffset = Scrollview.prototype.getPosition;

    /**
     * Sets the position of the physics particle that controls Scrollview instance's "position"
     *
     * @deprecated
     * @method setPosition
     * @param {number} x The amount of pixels you want your scrollview to progress by.
     */
    Scrollview.prototype.setPosition = function setPosition(x) {
        this._particle.setPosition1D(x);
    };

    /**
     * Sets the offset of the physics particle that controls Scrollview instance's "position"
     *
     * @method setPosition
     * @param {number} x The amount of pixels you want your scrollview to progress by.
     */
    Scrollview.prototype.setOffset = Scrollview.prototype.setPosition;

    /**
     * Returns the Scrollview instance's velocity.
     *
     * @method getVelocity
     * @return {Number} The velocity.
     */

    Scrollview.prototype.getVelocity = function getVelocity() {
        return this._touchCount ? this._touchVelocity : this._particle.getVelocity1D();
    };

    /**
     * Sets the Scrollview instance's velocity. Until affected by input or another call of setVelocity
     *  the Scrollview instance will scroll at the passed-in velocity.
     *
     * @method setVelocity
     * @param {number} v The magnitude of the velocity.
     */
    Scrollview.prototype.setVelocity = function setVelocity(v) {
        this._particle.setVelocity1D(v);
    };

    /**
     * Patches the Scrollview instance's options with the passed-in ones.
     *
     * @method setOptions
     * @param {Options} options An object of configurable options for the Scrollview instance.
     */
    Scrollview.prototype.setOptions = function setOptions(options) {
        // preprocess custom options
        if (options.direction !== undefined) {
            if (options.direction === 'x') options.direction = Utility.Direction.X;
            else if (options.direction === 'y') options.direction = Utility.Direction.Y;
        }

        if (options.groupScroll !== this.options.groupScroll) {
            if (options.groupScroll)
                this.subscribe(this._scroller);
            else
                this.unsubscribe(this._scroller);
        }

        // patch custom options
        this._optionsManager.setOptions(options);

        // propagate options to sub-components

        // scroller sub-component
        this._scroller.setOptions(options);

        // physics sub-components
        if (options.drag !== undefined) this.drag.setOptions({strength: this.options.drag});
        if (options.friction !== undefined) this.friction.setOptions({strength: this.options.friction});
        if (options.edgePeriod !== undefined || options.edgeDamp !== undefined) {
            this.spring.setOptions({
                period: this.options.edgePeriod,
                dampingRatio: this.options.edgeDamp
            });
        }

        // sync sub-component
        if (options.rails || options.direction !== undefined || options.syncScale !== undefined || options.preventDefault) {
            this.sync.setOptions({
                rails: this.options.rails,
                direction: (this.options.direction === Utility.Direction.X) ? GenericSync.DIRECTION_X : GenericSync.DIRECTION_Y,
                scale: this.options.syncScale,
                preventDefault: this.options.preventDefault
            });
        }
    };

    /**
     * Sets the collection of renderables under the Scrollview instance's control, by
     *  setting its current node to the passed in ViewSequence. If you
     *  pass in an array, the Scrollview instance will set its node as a ViewSequence instantiated with
     *  the passed-in array.
     *
     * @method sequenceFrom
     * @param {Array|ViewSequence} node Either an array of renderables or a Famous viewSequence.
     */
    Scrollview.prototype.sequenceFrom = function sequenceFrom(node) {
        if (node instanceof Array) node = new ViewSequence({array: node, trackSize: true});
        this._node = node;
        return this._scroller.sequenceFrom(node);
    };

    /**
     * Returns the width and the height of the Scrollview instance.
     *
     * @method getSize
     * @return {Array} A two value array of the Scrollview instance's current width and height (in that order).
     */
    Scrollview.prototype.getSize = function getSize() {
        return this._scroller.getSize.apply(this._scroller, arguments);
    };

    /**
     * Generate a render spec from the contents of this component.
     *
     * @private
     * @method render
     * @return {number} Render spec for this component
     */
    Scrollview.prototype.render = function render() {
        if (this.options.paginated && this._needsPaginationCheck) _handlePagination.call(this);

        return this._scroller.render();
    };

    module.exports = Scrollview;
});

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: felix@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define('famous/views/ScrollContainer',['require','exports','module','../surfaces/ContainerSurface','../core/EventHandler','./Scrollview','../utilities/Utility','../core/OptionsManager'],function(require, exports, module) {
    var ContainerSurface = require('../surfaces/ContainerSurface');
    var EventHandler = require('../core/EventHandler');
    var Scrollview = require('./Scrollview');
    var Utility = require('../utilities/Utility');
    var OptionsManager = require('../core/OptionsManager');

    /**
     * A Container surface with a scrollview automatically added. The convenience of ScrollContainer lies in
     * being able to clip out portions of the associated scrollview that lie outside the bounding surface,
     * and in being able to move the scrollview more easily by applying modifiers to the parent container
     * surface.
     * @class ScrollContainer
     * @constructor
     * @param {Options} [options] An object of configurable options.
     * @param {Options} [options.container=undefined] Options for the ScrollContainer instance's surface.
     * @param {Options} [options.scrollview={direction:Utility.Direction.X}]  Options for the ScrollContainer instance's scrollview.
     */
    function ScrollContainer(options) {
        this.options = Object.create(ScrollContainer.DEFAULT_OPTIONS);
        this._optionsManager = new OptionsManager(this.options);

        if (options) this.setOptions(options);

        this.container = new ContainerSurface(this.options.container);
        this.scrollview = new Scrollview(this.options.scrollview);

        this.container.add(this.scrollview);

        this._eventInput = new EventHandler();
        EventHandler.setInputHandler(this, this._eventInput);

        this._eventInput.pipe(this.scrollview);

        this._eventOutput = new EventHandler();
        EventHandler.setOutputHandler(this, this._eventOutput);

        this.container.pipe(this._eventOutput);
        this.scrollview.pipe(this._eventOutput);
    }

    ScrollContainer.DEFAULT_OPTIONS = {
        container: {
            properties: {overflow : 'hidden'}
        },
        scrollview: {}
    };

    /**
     * Patches the ScrollContainer instance's options with the passed-in ones.
     *
     * @method setOptions
     * @param {Options} options An object of configurable options for the ScrollContainer instance.
     */
    ScrollContainer.prototype.setOptions = function setOptions(options) {
        return this._optionsManager.setOptions(options);
    };

    /**
     * Sets the collection of renderables under the ScrollContainer instance scrollview's control.
     *
     * @method sequenceFrom
     * @param {Array|ViewSequence} sequence Either an array of renderables or a Famous ViewSequence.
     */
    ScrollContainer.prototype.sequenceFrom = function sequenceFrom() {
        return this.scrollview.sequenceFrom.apply(this.scrollview, arguments);
    };

    /**
     * Returns the width and the height of the ScrollContainer instance.
     *
     * @method getSize
     * @return {Array} A two value array of the ScrollContainer instance's current width and height (in that order).
     */
    ScrollContainer.prototype.getSize = function getSize() {
        return this.container.getSize.apply(this.container, arguments);
    };

    /**
     * Generate a render spec from the contents of this component.
     *
     * @private
     * @method render
     * @return {number} Render spec for this component
     */
    ScrollContainer.prototype.render = function render() {
        return this.container.render();
    };

    module.exports = ScrollContainer;
});

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: mark@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define('famous/modifiers/StateModifier',['require','exports','module','../core/Modifier','../core/Transform','../transitions/Transitionable','../transitions/TransitionableTransform'],function(require, exports, module) {
    var Modifier = require('../core/Modifier');
    var Transform = require('../core/Transform');
    var Transitionable = require('../transitions/Transitionable');
    var TransitionableTransform = require('../transitions/TransitionableTransform');

    /**
     *  A collection of visual changes to be
     *    applied to another renderable component, strongly coupled with the state that defines
     *    those changes. This collection includes a
     *    transform matrix, an opacity constant, a size, an origin specifier, and an alignment specifier.
     *    StateModifier objects can be added to any RenderNode or object
     *    capable of displaying renderables.  The StateModifier's children and descendants
     *    are transformed by the amounts specified in the modifier's properties.
     *
     * @class StateModifier
     * @constructor
     * @param {Object} [options] overrides of default options
     * @param {Transform} [options.transform] affine transformation matrix
     * @param {Number} [options.opacity]
     * @param {Array.Number} [options.origin] origin adjustment
     * @param {Array.Number} [options.align] align adjustment
     * @param {Array.Number} [options.size] size to apply to descendants
     * @param {Array.Number} [options.propportions] proportions to apply to descendants
     */
    function StateModifier(options) {
        this._transformState = new TransitionableTransform(Transform.identity);
        this._opacityState = new Transitionable(1);
        this._originState = new Transitionable([0, 0]);
        this._alignState = new Transitionable([0, 0]);
        this._sizeState = new Transitionable([0, 0]);
        this._proportionsState = new Transitionable([0, 0]);

        this._modifier = new Modifier({
            transform: this._transformState,
            opacity: this._opacityState,
            origin: null,
            align: null,
            size: null,
            proportions: null
        });

        this._hasOrigin = false;
        this._hasAlign = false;
        this._hasSize = false;
        this._hasProportions = false;

        if (options) {
            if (options.transform) this.setTransform(options.transform);
            if (options.opacity !== undefined) this.setOpacity(options.opacity);
            if (options.origin) this.setOrigin(options.origin);
            if (options.align) this.setAlign(options.align);
            if (options.size) this.setSize(options.size);
            if (options.proportions) this.setProportions(options.proportions);
        }
    }

    /**
     * Set the transform matrix of this modifier, either statically or
     *   through a provided Transitionable.
     *
     * @method setTransform
     *
     * @param {Transform} transform Transform to transition to.
     * @param {Transitionable} transition object of type {duration: number, curve:
     *    f[0,1] -> [0,1] or name}. If transition is omitted, change will be
     *    instantaneous.
     * @param {Function} [callback] callback to call after transition completes
     * @return {StateModifier} this
     */
    StateModifier.prototype.setTransform = function setTransform(transform, transition, callback) {
        this._transformState.set(transform, transition, callback);
        return this;
    };

    /**
     * Set the opacity of this modifier, either statically or
     *   through a provided Transitionable.
     *
     * @method setOpacity
     *
     * @param {Number} opacity Opacity value to transition to.
     * @param {Transitionable} transition object of type {duration: number, curve:
     *    f[0,1] -> [0,1] or name}. If transition is omitted, change will be
     *    instantaneous.
     * @param {Function} callback callback to call after transition completes
     * @return {StateModifier} this
     */
    StateModifier.prototype.setOpacity = function setOpacity(opacity, transition, callback) {
        this._opacityState.set(opacity, transition, callback);
        return this;
    };

    /**
     * Set the origin of this modifier, either statically or
     *   through a provided Transitionable.
     *
     * @method setOrigin
     *
     * @param {Array.Number} origin two element array with values between 0 and 1.
     * @param {Transitionable} transition object of type {duration: number, curve:
     *    f[0,1] -> [0,1] or name}. If transition is omitted, change will be
     *    instantaneous.
     * @param {Function} callback callback to call after transition completes
     * @return {StateModifier} this
     */
    StateModifier.prototype.setOrigin = function setOrigin(origin, transition, callback) {
        if (origin === null) {
            if (this._hasOrigin) {
                this._modifier.originFrom(null);
                this._hasOrigin = false;
            }
            return this;
        }
        else if (!this._hasOrigin) {
            this._hasOrigin = true;
            this._modifier.originFrom(this._originState);
        }
        this._originState.set(origin, transition, callback);
        return this;
    };

    /**
     * Set the alignment of this modifier, either statically or
     *   through a provided Transitionable.
     *
     * @method setAlign
     *
     * @param {Array.Number} align two element array with values between 0 and 1.
     * @param {Transitionable} transition object of type {duration: number, curve:
     *    f[0,1] -> [0,1] or name}. If transition is omitted, change will be
     *    instantaneous.
     * @param {Function} callback callback to call after transition completes
     * @return {StateModifier} this
     */
    StateModifier.prototype.setAlign = function setOrigin(align, transition, callback) {
        if (align === null) {
            if (this._hasAlign) {
                this._modifier.alignFrom(null);
                this._hasAlign = false;
            }
            return this;
        }
        else if (!this._hasAlign) {
            this._hasAlign = true;
            this._modifier.alignFrom(this._alignState);
        }
        this._alignState.set(align, transition, callback);
        return this;
    };

    /**
     * Set the size of this modifier, either statically or
     *   through a provided Transitionable.
     *
     * @method setSize
     *
     * @param {Array.Number} size two element array of [width, height]
     * @param {Transitionable} transition object of type {duration: number, curve:
     *    f[0,1] -> [0,1] or name}. If transition is omitted, change will be
     *    instantaneous.
     * @param {Function} callback callback to call after transition completes
     * @return {StateModifier} this
     */
    StateModifier.prototype.setSize = function setSize(size, transition, callback) {
        if (size === null) {
            if (this._hasSize) {
                this._modifier.sizeFrom(null);
                this._hasSize = false;
            }
            return this;
        }
        else if (!this._hasSize) {
            this._hasSize = true;
            this._modifier.sizeFrom(this._sizeState);
        }
        this._sizeState.set(size, transition, callback);
        return this;
    };

    /**
     * Set the proportions of this modifier, either statically or
     *   through a provided Transitionable.
     *
     * @method setProportions
     *
     * @param {Array.Number} proportions two element array with values between 0 and 1.
     * @param {Transitionable} transition Valid transitionable object
     * @param {Function} callback callback to call after transition completes
     * @return {StateModifier} this
     */
    StateModifier.prototype.setProportions = function setSize(proportions, transition, callback) {
        if (proportions === null) {
            if (this._hasProportions) {
                this._modifier.proportionsFrom(null);
                this._hasProportions = false;
            }
            return this;
        }
        else if (!this._hasProportions) {
            this._hasProportions = true;
            this._modifier.proportionsFrom(this._proportionsState);
        }
        this._proportionsState.set(proportions, transition, callback);
        return this;
    };

    /**
     * Stop the transition.
     *
     * @method halt
     */
    StateModifier.prototype.halt = function halt() {
        this._transformState.halt();
        this._opacityState.halt();
        this._originState.halt();
        this._alignState.halt();
        this._sizeState.halt();
        this._proportionsState.halt();
    };

    /**
     * Get the current state of the transform matrix component.
     *
     * @method getTransform
     * @return {Object} transform provider object
     */
    StateModifier.prototype.getTransform = function getTransform() {
        return this._transformState.get();
    };

    /**
     * Get the destination state of the transform component.
     *
     * @method getFinalTransform
     * @return {Transform} transform matrix
     */
    StateModifier.prototype.getFinalTransform = function getFinalTransform() {
        return this._transformState.getFinal();
    };

    /**
     * Get the current state of the opacity component.
     *
     * @method getOpacity
     * @return {Object} opacity provider object
     */
    StateModifier.prototype.getOpacity = function getOpacity() {
        return this._opacityState.get();
    };

    /**
     * Get the current state of the origin component.
     *
     * @method getOrigin
     * @return {Object} origin provider object
     */
    StateModifier.prototype.getOrigin = function getOrigin() {
        return this._hasOrigin ? this._originState.get() : null;
    };

    /**
     * Get the current state of the align component.
     *
     * @method getAlign
     * @return {Object} align provider object
     */
    StateModifier.prototype.getAlign = function getAlign() {
        return this._hasAlign ? this._alignState.get() : null;
    };

    /**
     * Get the current state of the size component.
     *
     * @method getSize
     * @return {Object} size provider object
     */
    StateModifier.prototype.getSize = function getSize() {
        return this._hasSize ? this._sizeState.get() : null;
    };

    /**
     * Get the current state of the propportions component.
     *
     * @method getProportions
     * @return {Object} size provider object
     */
    StateModifier.prototype.getProportions = function getProportions() {
        return this._hasProportions ? this._proportionsState.get() : null;
    };

    /**
     * Return render spec for this StateModifier, applying to the provided
     *    target component.  This is similar to render() for Surfaces.
     *
     * @private
     * @method modify
     *
     * @param {Object} target (already rendered) render spec to
     *    which to apply the transform.
     * @return {Object} render spec for this StateModifier, including the
     *    provided target
     */
    StateModifier.prototype.modify = function modify(target) {
        return this._modifier.modify(target);
    };

    module.exports = StateModifier;
});

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: felix@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define('famous/views/GridLayout',['require','exports','module','../core/Entity','../core/RenderNode','../core/Transform','../core/ViewSequence','../core/EventHandler','../core/Modifier','../core/OptionsManager','../transitions/Transitionable','../transitions/TransitionableTransform'],function(require, exports, module) {
    var Entity = require('../core/Entity');
    var RenderNode = require('../core/RenderNode');
    var Transform = require('../core/Transform');
    var ViewSequence = require('../core/ViewSequence');
    var EventHandler = require('../core/EventHandler');
    var Modifier = require('../core/Modifier');
    var OptionsManager = require('../core/OptionsManager');
    var Transitionable = require('../transitions/Transitionable');
    var TransitionableTransform = require('../transitions/TransitionableTransform');

    /**
     * A layout which divides a context into several evenly-sized grid cells.
     *   If dimensions are provided, the grid is evenly subdivided with children
     *   cells representing their own context, otherwise the cellSize property is used to compute
     *   dimensions so that items of cellSize will fit.
     * @class GridLayout
     * @constructor
     * @param {Options} [options] An object of configurable options.
     * @param {Array.Number} [options.dimensions=[1, 1]] A two value array which specifies the amount of columns
     * and rows in your Gridlayout instance.
     * @param {Array.Number} [options.gutterSize=[0, 0]] A two-value array which specifies size of the
     * horizontal and vertical gutters between items in the grid layout.
     * @param {Transition} [options.transition=false] The transiton that controls the Gridlayout instance's reflow.
     */
    function GridLayout(options) {
        this.options = Object.create(GridLayout.DEFAULT_OPTIONS);
        this.optionsManager = new OptionsManager(this.options);
        if (options) this.setOptions(options);

        this.id = Entity.register(this);

        this._modifiers = [];
        this._states = [];
        this._contextSizeCache = [0, 0];
        this._dimensionsCache = [0, 0];
        this._activeCount = 0;

        this._eventOutput = new EventHandler();
        EventHandler.setOutputHandler(this, this._eventOutput);
    }

    function _reflow(size, cols, rows) {
        var usableSize = [size[0], size[1]];
        usableSize[0] -= this.options.gutterSize[0] * (cols - 1);
        usableSize[1] -= this.options.gutterSize[1] * (rows - 1);

        var rowSize = Math.round(usableSize[1] / rows);
        var colSize = Math.round(usableSize[0] / cols);

        var currY = 0;
        var currX;
        var currIndex = 0;
        for (var i = 0; i < rows; i++) {
            currX = 0;
            for (var j = 0; j < cols; j++) {
                if (this._modifiers[currIndex] === undefined) {
                    _createModifier.call(this, currIndex, [colSize, rowSize], [currX, currY, 0], 1);
                }
                else {
                    _animateModifier.call(this, currIndex, [colSize, rowSize], [currX, currY, 0], 1);
                }

                currIndex++;
                currX += colSize + this.options.gutterSize[0];
            }

            currY += rowSize + this.options.gutterSize[1];
        }

        this._dimensionsCache = [this.options.dimensions[0], this.options.dimensions[1]];
        this._contextSizeCache = [size[0], size[1]];

        this._activeCount = rows * cols;

        for (i = this._activeCount ; i < this._modifiers.length; i++) _animateModifier.call(this, i, [Math.round(colSize), Math.round(rowSize)], [0, 0], 0);

        this._eventOutput.emit('reflow');
    }

    function _createModifier(index, size, position, opacity) {
        var transitionItem = {
            transform: new TransitionableTransform(Transform.translate.apply(null, position)),
            opacity: new Transitionable(opacity),
            size: new Transitionable(size)
        };

        var modifier = new Modifier({
            transform: transitionItem.transform,
            opacity: transitionItem.opacity,
            size: transitionItem.size
        });

        this._states[index] = transitionItem;
        this._modifiers[index] = modifier;

    }

    function _animateModifier(index, size, position, opacity) {
        var currState = this._states[index];

        var currSize = currState.size;
        var currOpacity = currState.opacity;
        var currTransform = currState.transform;

        var transition = this.options.transition;

        currTransform.halt();
        currOpacity.halt();
        currSize.halt();

        currTransform.setTranslate(position, transition);
        currSize.set(size, transition);
        currOpacity.set(opacity, transition);
    }

    GridLayout.DEFAULT_OPTIONS = {
        dimensions: [1, 1],
        transition: false,
        gutterSize: [0, 0]
    };

    /**
     * Generate a render spec from the contents of this component.
     *
     * @private
     * @method render
     * @return {Object} Render spec for this component
     */
    GridLayout.prototype.render = function render() {
        return this.id;
    };

    /**
     * Patches the GridLayout instance's options with the passed-in ones.
     *
     * @method setOptions
     * @param {Options} options An object of configurable options for the GridLayout instance.
     */
    GridLayout.prototype.setOptions = function setOptions(options) {
        return this.optionsManager.setOptions(options);
    };

    /**
     * Sets the collection of renderables under the Gridlayout instance's control.
     *
     * @method sequenceFrom
     * @param {Array|ViewSequence} sequence Either an array of renderables or a Famous viewSequence.
     */
    GridLayout.prototype.sequenceFrom = function sequenceFrom(sequence) {
        if (sequence instanceof Array) sequence = new ViewSequence(sequence);
        this.sequence = sequence;
    };

    /**
     * Returns the size of the grid layout.
     *
     * @method getSize
     * @return {Array} Total size of the grid layout.
     */
    GridLayout.prototype.getSize = function getSize() {
      return this._contextSizeCache;
    };

    /**
     * Apply changes from this component to the corresponding document element.
     * This includes changes to classes, styles, size, content, opacity, origin,
     * and matrix transforms.
     *
     * @private
     * @method commit
     * @param {Context} context commit context
     */
    GridLayout.prototype.commit = function commit(context) {
        var transform = context.transform;
        var opacity = context.opacity;
        var origin = context.origin;
        var size = context.size;

        var cols = this.options.dimensions[0];
        var rows = this.options.dimensions[1];

        if (size[0] !== this._contextSizeCache[0] || size[1] !== this._contextSizeCache[1] || cols !== this._dimensionsCache[0] || rows !== this._dimensionsCache[1]) {
            _reflow.call(this, size, cols, rows);
        }

        var sequence = this.sequence;
        var result = [];
        var currIndex = 0;
        while (sequence && (currIndex < this._modifiers.length)) {
            var item = sequence.get();
            var modifier = this._modifiers[currIndex];
            if (currIndex >= this._activeCount && this._states[currIndex].opacity.isActive()) {
                this._modifiers.splice(currIndex, 1);
                this._states.splice(currIndex, 1);
            }
            if (item) {
                result.push(
                    modifier.modify({
                        origin: origin,
                        target: item.render()
                    })
                );
            }
            sequence = sequence.getNext();
            currIndex++;
        }

        if (size) transform = Transform.moveThen([-size[0]*origin[0], -size[1]*origin[1], 0], transform);
        return {
            transform: transform,
            opacity: opacity,
            size: size,
            target: result
        };
    };

    module.exports = GridLayout;
});

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: mike@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define('famous/views/FlexibleLayout',['require','exports','module','../core/Entity','../core/Transform','../core/OptionsManager','../core/EventHandler','../transitions/Transitionable'],function(require, exports, module) {
    var Entity = require('../core/Entity');
    var Transform = require('../core/Transform');
    var OptionsManager = require('../core/OptionsManager');
    var EventHandler = require('../core/EventHandler');
    var Transitionable = require('../transitions/Transitionable');

    /**
     * A layout which divides a context into sections based on a proportion
     *   of the total sum of ratios.  FlexibleLayout can either lay renderables
     *   out vertically or horizontally.
     * @class FlexibleLayout
     * @constructor
     * @param {Options} [options] An object of configurable options.
     * @param {Number} [options.direction=0] Direction the FlexibleLayout instance should lay out renderables.
     * @param {Transition} [options.transition=false] The transiton that controls the FlexibleLayout instance's reflow.
     * @param {Ratios} [options.ratios=[]] The proportions for the renderables to maintain
     */
    function FlexibleLayout(options) {
        this.options = Object.create(FlexibleLayout.DEFAULT_OPTIONS);
        this.optionsManager = new OptionsManager(this.options);
        if (options) this.setOptions(options);

        this.id = Entity.register(this);

        this._ratios = new Transitionable(this.options.ratios);
        this._nodes = [];
        this._size = [0, 0];

        this._cachedDirection = null;
        this._cachedLengths = [];
        this._cachedTransforms = null;
        this._ratiosDirty = false;

        this._eventOutput = new EventHandler();
        EventHandler.setOutputHandler(this, this._eventOutput);
    }

    FlexibleLayout.DIRECTION_X = 0;
    FlexibleLayout.DIRECTION_Y = 1;

    FlexibleLayout.DEFAULT_OPTIONS = {
        direction: FlexibleLayout.DIRECTION_X,
        transition: false,
        ratios : []
    };

    function _reflow(ratios, length, direction) {
        var currTransform;
        var translation = 0;
        var flexLength = length;
        var ratioSum = 0;
        var ratio;
        var node;
        var i;

        this._cachedLengths = [];
        this._cachedTransforms = [];

        for (i = 0; i < ratios.length; i++){
            ratio = ratios[i];
            node = this._nodes[i];

            if (typeof ratio !== 'number')
                flexLength -= node.getSize()[direction] || 0;
            else
                ratioSum += ratio;
        }

        for (i = 0; i < ratios.length; i++) {
            node = this._nodes[i];
            ratio = ratios[i];

            length = (typeof ratio === 'number')
                ? flexLength * ratio / ratioSum
                : node.getSize()[direction];

            currTransform = (direction === FlexibleLayout.DIRECTION_X)
                ? Transform.translate(translation, 0, 0)
                : Transform.translate(0, translation, 0);

            this._cachedTransforms.push(currTransform);
            this._cachedLengths.push(length);

            translation += length;
        }
    }

    function _trueSizedDirty(ratios, direction) {
        for (var i = 0; i < ratios.length; i++) {
            if (typeof ratios[i] !== 'number') {
                if (this._nodes[i].getSize()[direction] !== this._cachedLengths[i])
                    return true;
            }
        }

        return false;
    }

    /**
     * Generate a render spec from the contents of this component.
     *
     * @private
     * @method render
     * @return {Object} Render spec for this component
     */
    FlexibleLayout.prototype.render = function render() {
        return this.id;
    };

    /**
     * Patches the FlexibleLayouts instance's options with the passed-in ones.
     *
     * @method setOptions
     * @param {Options} options An object of configurable options for the FlexibleLayout instance.
     */
    FlexibleLayout.prototype.setOptions = function setOptions(options) {
        this.optionsManager.setOptions(options);
    };

    /**
     * Sets the collection of renderables under the FlexibleLayout instance's control.  Also sets
     * the associated ratio values for sizing the renderables if given.
     *
     * @method sequenceFrom
     * @param {Array} sequence An array of renderables.
     */
    FlexibleLayout.prototype.sequenceFrom = function sequenceFrom(sequence) {
        this._nodes = sequence;

        if (this._ratios.get().length === 0) {
            var ratios = [];
            for (var i = 0; i < this._nodes.length; i++) ratios.push(1);
            this.setRatios(ratios);
        }
    };

    /**
     * Sets the associated ratio values for sizing the renderables.
     *
     * @method setRatios
     * @param {Array} ratios Array of ratios corresponding to the percentage sizes each renderable should be
     */
    FlexibleLayout.prototype.setRatios = function setRatios(ratios, transition, callback) {
        if (transition === undefined) transition = this.options.transition;
        var currRatios = this._ratios;
        if (currRatios.get().length === 0) transition = undefined;
        if (currRatios.isActive()) currRatios.halt();
        currRatios.set(ratios, transition, callback);
        this._ratiosDirty = true;
    };

    /**
     * Gets the size of the context the FlexibleLayout exists within.
     *
     * @method getSize
     *
     * @return {Array} Size of the FlexibleLayout in pixels [width, height]
     */
    FlexibleLayout.prototype.getSize = function getSize() {
        return this._size;
    };

    /**
     * Apply changes from this component to the corresponding document element.
     * This includes changes to classes, styles, size, content, opacity, origin,
     * and matrix transforms.
     *
     * @private
     * @method commit
     * @param {Context} context commit context
     */
    FlexibleLayout.prototype.commit = function commit(context) {
        var parentSize = context.size;
        var parentTransform = context.transform;
        var parentOrigin = context.origin;
        var parentOpacity = context.opacity;

        var ratios = this._ratios.get();
        var direction = this.options.direction;
        var length = parentSize[direction];
        var size;

        if (length !== this._size[direction] || this._ratiosDirty || this._ratios.isActive() || direction !== this._cachedDirection || _trueSizedDirty.call(this, ratios, direction)) {
            _reflow.call(this, ratios, length, direction);

            if (length !== this._size[direction]) {
                this._size[0] = parentSize[0];
                this._size[1] = parentSize[1];
            }

            if (direction !== this._cachedDirection) this._cachedDirection = direction;
            if (this._ratiosDirty) this._ratiosDirty = false;
        }

        var result = [];
        for (var i = 0; i < ratios.length; i++) {
            size = [undefined, undefined];
            length = this._cachedLengths[i];
            size[direction] = length;
            result.push({
                transform : this._cachedTransforms[i],
                size: size,
                target : this._nodes[i].render()
            });
        }

        if (parentSize && (parentOrigin[0] !== 0 && parentOrigin[1] !== 0))
            parentTransform = Transform.moveThen([-parentSize[0]*parentOrigin[0], -parentSize[1]*parentOrigin[1], 0], parentTransform);

        return {
            transform: parentTransform,
            size: parentSize,
            opacity: parentOpacity,
            target: result
        };
    };

    module.exports = FlexibleLayout;
});

define('views/LanguagePieView',['require','exports','module','famous/core/Surface','famous/core/Modifier','famous/core/Transform','famous/core/View','famous/views/FlexibleLayout','famous/utilities/Timer','famous/core/EventHandler','famous/transitions/Transitionable'],function (require, exports, module) {
    var Surface = require('famous/core/Surface');
    var Modifier = require('famous/core/Modifier');
    var Transform = require('famous/core/Transform');
    var View = require('famous/core/View');
    var FlexibleLayout = require('famous/views/FlexibleLayout');
    var Timer = require('famous/utilities/Timer');
    var EventHandler = require('famous/core/EventHandler');

    var Transitionable = require('famous/transitions/Transitionable');


    function LanguagePieView(genericSync) {
        var that = this;
        View.apply(this, arguments);

        this.eventInput = new EventHandler();
        this.eventOutput = new EventHandler();
        EventHandler.setInputHandler(this, this.eventInput);
        EventHandler.setOutputHandler(this, this.eventOutput);

        var flex = new FlexibleLayout({
            ratios: [2, 10]
        });
        var windowWidth = window.innerWidth;
        var windowHeight = window.innerHeight;
        var widthScale = 0.82;
        var svgScale = 0.1;
        this.contentWidth = widthScale * windowWidth;
        this.svgWidth = Math.floor(svgScale * windowWidth);
        var svgLanguage = _createLanguageSvg(this.svgWidth);

        var transWidth = new Transitionable([this.contentWidth, 100]);
        window.onresize = function () {
            windowWidth = window.innerWidth;
        }


        this.languageModifier = new Modifier({
            size: transWidth.get(),
            transform: Transform.translate(0, 0, 10),
            origin: [0.5, 0],
            align: [0.5, 0]
        });
        this.svgLanguage = new Surface({
            size: [undefined, undefined],
            content: svgLanguage,
            properties: {
                fontSize: '11px',
                zIndex: 10
            }
        });

        this.textLanguage = new Surface({
            size: [undefined, undefined],
            content: '<h2> Language</h2><p>Ukrainian, Lithuanian, Bulgarian, and other Eastern European communities speak Russian, which makes the Russian speaking community the second largest segment of the foreign born US population, which is estimated at 5 million people.</p>',
            properties: {
                zIndex: 10
            }
        });
        var languageContent = [];
        languageContent.push(this.svgLanguage);
        languageContent.push(this.textLanguage);
        flex.sequenceFrom(languageContent);

        this.bgColor = new Surface({
            size: [undefined, undefined],
            properties: {
                backgroundColor: '#FFFAE2'
            }

        });
        this.svgLanguage.pipe(genericSync);
        this.add(this.bgColor);
        this.add(this.languageModifier).add(flex);
    }

    function _createLanguageSvg(width) {
        var svgLanguage = document.createElementNS(d3.ns.prefix.svg, 'svg');

        var w = width;
        var h = w;
        var r = h / 2;
        var color = d3.scale.category20c();
        var data = [{"label": "Russian", "value": 20},
            {"label": "Hispanic", "value": 50},
            {"label": "Others", "value": 30}];
        var vis = d3.select(svgLanguage).data([data]).attr("width", w).attr("height", h).append("svg:g").attr("transform", "translate(" + r + "," + r + ")");
        var pie = d3.layout.pie().value(function (d) {
            return d.value;
        });

        var arc = d3.svg.arc().outerRadius(r);

        var arcs = vis.selectAll("g.slice").data(pie).enter().append("svg:g").attr("class", "slice");
        arcs.append("svg:path")
            .attr("fill", function (d, i) {
                return color(i);
            })
            .attr("d", function (d) {
                return arc(d);
            });

        arcs.append("svg:text").attr("transform", function (d) {
            d.innerRadius = 0;
            d.outerRadius = r;
            return "translate(" + arc.centroid(d) + ")";
        }).attr("text-anchor", "middle").text(function (d, i) {
                return data[i].label;
            }
        );
        return svgLanguage;
    }

    LanguagePieView.prototype = Object.create(View.prototype);
    LanguagePieView.prototype.constructor = LanguagePieView;


    LanguagePieView.DEFAULT_OPTIONS = {};


    module.exports = LanguagePieView;
});

/**
 * @license RequireJS text 2.0.12 Copyright (c) 2010-2014, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/requirejs/text for details
 */
/*jslint regexp: true */
/*global require, XMLHttpRequest, ActiveXObject,
  define, window, process, Packages,
  java, location, Components, FileUtils */

define('text',['module'], function (module) {
    

    var text, fs, Cc, Ci, xpcIsWindows,
        progIds = ['Msxml2.XMLHTTP', 'Microsoft.XMLHTTP', 'Msxml2.XMLHTTP.4.0'],
        xmlRegExp = /^\s*<\?xml(\s)+version=[\'\"](\d)*.(\d)*[\'\"](\s)*\?>/im,
        bodyRegExp = /<body[^>]*>\s*([\s\S]+)\s*<\/body>/im,
        hasLocation = typeof location !== 'undefined' && location.href,
        defaultProtocol = hasLocation && location.protocol && location.protocol.replace(/\:/, ''),
        defaultHostName = hasLocation && location.hostname,
        defaultPort = hasLocation && (location.port || undefined),
        buildMap = {},
        masterConfig = (module.config && module.config()) || {};

    text = {
        version: '2.0.12',

        strip: function (content) {
            //Strips <?xml ...?> declarations so that external SVG and XML
            //documents can be added to a document without worry. Also, if the string
            //is an HTML document, only the part inside the body tag is returned.
            if (content) {
                content = content.replace(xmlRegExp, "");
                var matches = content.match(bodyRegExp);
                if (matches) {
                    content = matches[1];
                }
            } else {
                content = "";
            }
            return content;
        },

        jsEscape: function (content) {
            return content.replace(/(['\\])/g, '\\$1')
                .replace(/[\f]/g, "\\f")
                .replace(/[\b]/g, "\\b")
                .replace(/[\n]/g, "\\n")
                .replace(/[\t]/g, "\\t")
                .replace(/[\r]/g, "\\r")
                .replace(/[\u2028]/g, "\\u2028")
                .replace(/[\u2029]/g, "\\u2029");
        },

        createXhr: masterConfig.createXhr || function () {
            //Would love to dump the ActiveX crap in here. Need IE 6 to die first.
            var xhr, i, progId;
            if (typeof XMLHttpRequest !== "undefined") {
                return new XMLHttpRequest();
            } else if (typeof ActiveXObject !== "undefined") {
                for (i = 0; i < 3; i += 1) {
                    progId = progIds[i];
                    try {
                        xhr = new ActiveXObject(progId);
                    } catch (e) {}

                    if (xhr) {
                        progIds = [progId];  // so faster next time
                        break;
                    }
                }
            }

            return xhr;
        },

        /**
         * Parses a resource name into its component parts. Resource names
         * look like: module/name.ext!strip, where the !strip part is
         * optional.
         * @param {String} name the resource name
         * @returns {Object} with properties "moduleName", "ext" and "strip"
         * where strip is a boolean.
         */
        parseName: function (name) {
            var modName, ext, temp,
                strip = false,
                index = name.indexOf("."),
                isRelative = name.indexOf('./') === 0 ||
                             name.indexOf('../') === 0;

            if (index !== -1 && (!isRelative || index > 1)) {
                modName = name.substring(0, index);
                ext = name.substring(index + 1, name.length);
            } else {
                modName = name;
            }

            temp = ext || modName;
            index = temp.indexOf("!");
            if (index !== -1) {
                //Pull off the strip arg.
                strip = temp.substring(index + 1) === "strip";
                temp = temp.substring(0, index);
                if (ext) {
                    ext = temp;
                } else {
                    modName = temp;
                }
            }

            return {
                moduleName: modName,
                ext: ext,
                strip: strip
            };
        },

        xdRegExp: /^((\w+)\:)?\/\/([^\/\\]+)/,

        /**
         * Is an URL on another domain. Only works for browser use, returns
         * false in non-browser environments. Only used to know if an
         * optimized .js version of a text resource should be loaded
         * instead.
         * @param {String} url
         * @returns Boolean
         */
        useXhr: function (url, protocol, hostname, port) {
            var uProtocol, uHostName, uPort,
                match = text.xdRegExp.exec(url);
            if (!match) {
                return true;
            }
            uProtocol = match[2];
            uHostName = match[3];

            uHostName = uHostName.split(':');
            uPort = uHostName[1];
            uHostName = uHostName[0];

            return (!uProtocol || uProtocol === protocol) &&
                   (!uHostName || uHostName.toLowerCase() === hostname.toLowerCase()) &&
                   ((!uPort && !uHostName) || uPort === port);
        },

        finishLoad: function (name, strip, content, onLoad) {
            content = strip ? text.strip(content) : content;
            if (masterConfig.isBuild) {
                buildMap[name] = content;
            }
            onLoad(content);
        },

        load: function (name, req, onLoad, config) {
            //Name has format: some.module.filext!strip
            //The strip part is optional.
            //if strip is present, then that means only get the string contents
            //inside a body tag in an HTML string. For XML/SVG content it means
            //removing the <?xml ...?> declarations so the content can be inserted
            //into the current doc without problems.

            // Do not bother with the work if a build and text will
            // not be inlined.
            if (config && config.isBuild && !config.inlineText) {
                onLoad();
                return;
            }

            masterConfig.isBuild = config && config.isBuild;

            var parsed = text.parseName(name),
                nonStripName = parsed.moduleName +
                    (parsed.ext ? '.' + parsed.ext : ''),
                url = req.toUrl(nonStripName),
                useXhr = (masterConfig.useXhr) ||
                         text.useXhr;

            // Do not load if it is an empty: url
            if (url.indexOf('empty:') === 0) {
                onLoad();
                return;
            }

            //Load the text. Use XHR if possible and in a browser.
            if (!hasLocation || useXhr(url, defaultProtocol, defaultHostName, defaultPort)) {
                text.get(url, function (content) {
                    text.finishLoad(name, parsed.strip, content, onLoad);
                }, function (err) {
                    if (onLoad.error) {
                        onLoad.error(err);
                    }
                });
            } else {
                //Need to fetch the resource across domains. Assume
                //the resource has been optimized into a JS module. Fetch
                //by the module name + extension, but do not include the
                //!strip part to avoid file system issues.
                req([nonStripName], function (content) {
                    text.finishLoad(parsed.moduleName + '.' + parsed.ext,
                                    parsed.strip, content, onLoad);
                });
            }
        },

        write: function (pluginName, moduleName, write, config) {
            if (buildMap.hasOwnProperty(moduleName)) {
                var content = text.jsEscape(buildMap[moduleName]);
                write.asModule(pluginName + "!" + moduleName,
                               "define(function () { return '" +
                                   content +
                               "';});\n");
            }
        },

        writeFile: function (pluginName, moduleName, req, write, config) {
            var parsed = text.parseName(moduleName),
                extPart = parsed.ext ? '.' + parsed.ext : '',
                nonStripName = parsed.moduleName + extPart,
                //Use a '.js' file name so that it indicates it is a
                //script that can be loaded across domains.
                fileName = req.toUrl(parsed.moduleName + extPart) + '.js';

            //Leverage own load() method to load plugin value, but only
            //write out values that do not have the strip argument,
            //to avoid any potential issues with ! in file names.
            text.load(nonStripName, req, function (value) {
                //Use own write() method to construct full module value.
                //But need to create shell that translates writeFile's
                //write() to the right interface.
                var textWrite = function (contents) {
                    return write(fileName, contents);
                };
                textWrite.asModule = function (moduleName, contents) {
                    return write.asModule(moduleName, fileName, contents);
                };

                text.write(pluginName, nonStripName, textWrite, config);
            }, config);
        }
    };

    if (masterConfig.env === 'node' || (!masterConfig.env &&
            typeof process !== "undefined" &&
            process.versions &&
            !!process.versions.node &&
            !process.versions['node-webkit'])) {
        //Using special require.nodeRequire, something added by r.js.
        fs = require.nodeRequire('fs');

        text.get = function (url, callback, errback) {
            try {
                var file = fs.readFileSync(url, 'utf8');
                //Remove BOM (Byte Mark Order) from utf8 files if it is there.
                if (file.indexOf('\uFEFF') === 0) {
                    file = file.substring(1);
                }
                callback(file);
            } catch (e) {
                if (errback) {
                    errback(e);
                }
            }
        };
    } else if (masterConfig.env === 'xhr' || (!masterConfig.env &&
            text.createXhr())) {
        text.get = function (url, callback, errback, headers) {
            var xhr = text.createXhr(), header;
            xhr.open('GET', url, true);

            //Allow plugins direct access to xhr headers
            if (headers) {
                for (header in headers) {
                    if (headers.hasOwnProperty(header)) {
                        xhr.setRequestHeader(header.toLowerCase(), headers[header]);
                    }
                }
            }

            //Allow overrides specified in config
            if (masterConfig.onXhr) {
                masterConfig.onXhr(xhr, url);
            }

            xhr.onreadystatechange = function (evt) {
                var status, err;
                //Do not explicitly handle errors, those should be
                //visible via console output in the browser.
                if (xhr.readyState === 4) {
                    status = xhr.status || 0;
                    if (status > 399 && status < 600) {
                        //An http 4xx or 5xx error. Signal an error.
                        err = new Error(url + ' HTTP status: ' + status);
                        err.xhr = xhr;
                        if (errback) {
                            errback(err);
                        }
                    } else {
                        callback(xhr.responseText);
                    }

                    if (masterConfig.onXhrComplete) {
                        masterConfig.onXhrComplete(xhr, url);
                    }
                }
            };
            xhr.send(null);
        };
    } else if (masterConfig.env === 'rhino' || (!masterConfig.env &&
            typeof Packages !== 'undefined' && typeof java !== 'undefined')) {
        //Why Java, why is this so awkward?
        text.get = function (url, callback) {
            var stringBuffer, line,
                encoding = "utf-8",
                file = new java.io.File(url),
                lineSeparator = java.lang.System.getProperty("line.separator"),
                input = new java.io.BufferedReader(new java.io.InputStreamReader(new java.io.FileInputStream(file), encoding)),
                content = '';
            try {
                stringBuffer = new java.lang.StringBuffer();
                line = input.readLine();

                // Byte Order Mark (BOM) - The Unicode Standard, version 3.0, page 324
                // http://www.unicode.org/faq/utf_bom.html

                // Note that when we use utf-8, the BOM should appear as "EF BB BF", but it doesn't due to this bug in the JDK:
                // http://bugs.sun.com/bugdatabase/view_bug.do?bug_id=4508058
                if (line && line.length() && line.charAt(0) === 0xfeff) {
                    // Eat the BOM, since we've already found the encoding on this file,
                    // and we plan to concatenating this buffer with others; the BOM should
                    // only appear at the top of a file.
                    line = line.substring(1);
                }

                if (line !== null) {
                    stringBuffer.append(line);
                }

                while ((line = input.readLine()) !== null) {
                    stringBuffer.append(lineSeparator);
                    stringBuffer.append(line);
                }
                //Make sure we return a JavaScript string and not a Java string.
                content = String(stringBuffer.toString()); //String
            } finally {
                input.close();
            }
            callback(content);
        };
    } else if (masterConfig.env === 'xpconnect' || (!masterConfig.env &&
            typeof Components !== 'undefined' && Components.classes &&
            Components.interfaces)) {
        //Avert your gaze!
        Cc = Components.classes;
        Ci = Components.interfaces;
        Components.utils['import']('resource://gre/modules/FileUtils.jsm');
        xpcIsWindows = ('@mozilla.org/windows-registry-key;1' in Cc);

        text.get = function (url, callback) {
            var inStream, convertStream, fileObj,
                readData = {};

            if (xpcIsWindows) {
                url = url.replace(/\//g, '\\');
            }

            fileObj = new FileUtils.File(url);

            //XPCOM, you so crazy
            try {
                inStream = Cc['@mozilla.org/network/file-input-stream;1']
                           .createInstance(Ci.nsIFileInputStream);
                inStream.init(fileObj, 1, 0, false);

                convertStream = Cc['@mozilla.org/intl/converter-input-stream;1']
                                .createInstance(Ci.nsIConverterInputStream);
                convertStream.init(inStream, "utf-8", inStream.available(),
                Ci.nsIConverterInputStream.DEFAULT_REPLACEMENT_CHARACTER);

                convertStream.readString(inStream.available(), readData);
                convertStream.close();
                inStream.close();
                callback(readData.value);
            } catch (e) {
                throw new Error((fileObj && fileObj.path || '') + ': ' + e);
            }
        };
    }
    return text;
});

define('text!jade/demographicsPage.html',[],function () { return '\r\n<section class="svet-services">\r\n  <article class="dem-content-top">\r\n    <div class="h-services text-center">Demographics</div>\r\n    <p class="text-center">The Russian - American population in the United States is estimated at nearly</p>\r\n    <h2 class="text-center">2.9 million people</h2><br/>\r\n    <p>It is the second largest ethnic market, making up 10.4% of 28.4 million foreign born people in the country.</p>\r\n    <h4>States with the highest concentration of the Russian-American population:</h4>\r\n    <p>New York Tri-State area – 24% (approx. 696,000 people)<br/>California – 17% (approx. 493,000 people)<br/>Illinois – 16% (approx. 464,000 plus people)</p>\r\n  </article>\r\n  <aside class="sun-times">\r\n    <div class="chicago-news text-center"><img src="img/dem/map.jpg"/></div>\r\n  </aside>\r\n</section>';});

define('text!jade/demographicsPart2.html',[],function () { return '\n<section class="svet-services"><br/>\n  <article class="dem-content-bottom">\n    <h2>Household</h2>\n    <p>\n      •\t64% are married with an average of 1.6 children per family.\n      • 57% are homeowners (compared to 41% for all US foreign born)\n    </p>\n    <h2>Income</h2>\n    <p>\n      • Average Annual Household Income is $87,500.\n      • 27.4% have an income of $100,000 or higher.\n    </p>\n    <h2>Education</h2>\n    <p>\n      • 63% of the population hold a bachelor\'s degree or higher.\n      • 82.3% have a High School Diplomas (compared to 67% for all foreign born population).\n      The inclination of this second largest foreign-born market segment towards higher education and high-paying employment ultimately leads to higher readership.\n    </p>\n    <h2>Age average</h2>\n    <p>\n      The median age is 32.5 years (compared to 38.1 years for all foreign born).\n      • 33.8% are 55 years old and over\n      • 57.6% are 25-54 years old\n      • 8.6% are 0-24 years oldsegment towards higher education and high-paying employment ultimately leads to higher readership.\n    </p>\n    <h2>Employment</h2>\n    <p>\n      As an educated community, Russian-Americans focus more on business ownership and post-collegiate work, which results in higher-paying employment.\n      • 67.5% hold managerial, technical and sales occupations (compared to 45.6% within these same areas for all foreign-born).\n      • 21.4% are employed in service occupations (compared to 31.2% for all foreign-born).\n      • 11.9% are employed as operators, fabricators and/or laborers (compared to 18.7% for all foreign-born).\n    </p>\n  </article>\n</section>';});

define('views/DemographicView',['require','exports','module','famous/core/Surface','famous/core/Modifier','famous/core/Transform','famous/core/View','famous/views/GridLayout','famous/utilities/Timer','famous/core/EventHandler','views/LanguagePieView','text!jade/demographicsPage.html','text!jade/demographicsPart2.html'],function (require, exports, module) {
    var Surface = require('famous/core/Surface');
    var Modifier = require('famous/core/Modifier');
    var Transform = require('famous/core/Transform');
    var View = require('famous/core/View');
    var GridLayout = require('famous/views/GridLayout');
    var Timer = require('famous/utilities/Timer');
    var EventHandler = require('famous/core/EventHandler');
    var LanguagePieView = require('views/LanguagePieView');


    function DemographicView(genericSync) {
        var that = this;
        View.apply(this, arguments);

        this.eventInput = new EventHandler();
        this.eventOutput = new EventHandler();
        EventHandler.setInputHandler(this, this.eventInput);
        EventHandler.setOutputHandler(this, this.eventOutput);

        var demographicsPart1 = require('text!jade/demographicsPage.html');
        var demographicsPart2 = require('text!jade/demographicsPart2.html');

        this.contentPart1 = new Surface({
            size: [undefined, undefined],
            content: demographicsPart1,
            properties: {
                backgroundColor: '#FFFAE2'
            }
        });
        this.languagePieView = new LanguagePieView(genericSync);

        this.contentPart3 = new Surface({
            size: [undefined, undefined],
            content: demographicsPart2,
            properties: {
                backgroundColor: '#FFFAE2'
            }
        });
        var demographContent = [];
        demographContent.push(this.contentPart1);
        demographContent.push(this.languagePieView);
        demographContent.push(this.contentPart3);

        var grid = new GridLayout({
            direction: 1,
            dimensions: [1, 3]
        });
        grid.sequenceFrom(demographContent);

        this.add(grid);

        this.contentPart1.pipe(genericSync);
        this.contentPart3.pipe(genericSync);

    }


    DemographicView.prototype = Object.create(View.prototype);
    DemographicView.prototype.constructor = DemographicView;


    DemographicView.DEFAULT_OPTIONS = {};


    module.exports = DemographicView;
});

define('text!jade/homePage.html',[],function () { return '\n<section>\n  <article class="svet-media-group">\n    <h2 class="h-services text-center">SVET Russian Media Group</h2>\n    <p class="text-center">is the Midwest’s first and oldest publishing and advertising company serving the Russian, Ukrainian and Lithuanian communities since 1990.</p>\n  </article>\n  <article class="svet-services">\n    <div class="productsServises">\n      <div class="home-icon-container"></div>\n      <div class="h-home">SVET<br/>Daily Newspaper</div>\n      <p>Over 48 pages – circulation 12,000 copies weekly. It is the most up-to-date Russian language newspaper outside of Russia. It appears on the newsstands after 3:00 PM. It is free of charge. In addition, subscribers receive newspapers in their homes via second class mail.</p>\n    </div>\n    <div class="productsServises">\n      <div class="home-icon-container"></div>\n      <div class="h-home">Russian-American<br/>Yellow Pages</div>\n      <p>The Russian Yellow Pages present over 650 full color pages of services and products to the Russian-speaking community in the Chicagoland area. Free distribution in Chicago and its North and Northwestern suburbs.</p>\n    </div>\n    <div class="productsServises">\n      <div class="home-icon-container"></div>\n      <div class="h-home">Saturday Plus<br/>Weekly Newspaper</div>\n      <p>Free Paper with over 48 pages weekly. It covers entertainment and other social news in Unites States and abroad. It packs the latest information on travel destinations and hot vacation spots.</p>\n    </div>\n    <div class="productsServises">\n      <div class="home-icon-container"></div>\n      <div class="h-home">Radio<br/>Program “OSA”</div>\n      <p>Sunday morning talk show with Alex Etman airs every Sunday on 1240 AM radio from 11:00 a.m. to 1:00 p.m. listen to Radio OSA programs.</p>\n    </div>\n  </article>\n</section>';});

define('text!jade/aboutUsPage.html',[],function () { return '\n<section class="svet-services">\n  <aside class="sun-times">\n    <div class="chicago-news text-center"><img src="img/aboutUs/aboutus_1.jpg"/></div>\n  </aside>\n  <article class="about-content-top">\n    <div class="h-services text-center">SVET International publishing house</div>\n    <p>From the viewpoint of our partners SVET International Publishing House is a typical "company with the past", which basic philosophy is hinged upon well-taken conservatism, weighed approach and clear calculations. It was not for nothing that all previous outside convulsions and crises bypassed our publishing house. Our meticulous attitude towards entering into deals is completely justified by strict performance of undertaken liabilities and flawless financial stability.</p>\n    <p>The competitors consider SVET International Publishing House to be a typical "company with the future", with steady dynamic growth of all indicators which have to be taken into account willingly or not. Once in two years a completely new project is given birth, which is introducing radical changes into the ethnic publishing market in Chicagoland.</p>\n    <p>Our colleagues recognize with an imperceptible shade of envy that the SVET International Publishing house managed to combine incompatible things: the creative approach to technologies and technological approach to creativity.</p>\n  </article>\n</section>\n<section class="svet-services"><br/>\n  <article class="about-content-bottom">\n    <p>One more feature is even more intriguing. For some reason it is a current belief that poverty and dependence are inherent to the nature of every writing person. This formula is overturned by the very existence of SVET Publishing House where creativity in journalism is rated as high as commercial or administrative skills.</p>\n    <p>The fact of popularity of SVET\'s publications speaks for itself and do not need any further commends. Each paper is ranking highest among other press publications in its field. The total circulation of publishing house is leading well ahead all other Chicago-based Russian language press publications at large.</p>\n    <p>Over the past THIRTEEN years our publishing house has accumulated a considerable brainpower and intellectual potential. Journalists and designers regard invitation for work in SVET International Publishing House as a highest appreciation of their proficiency and skills.</p>\n    <p>What does it mean in the real life? Our partners can completely rely on immaculate professionalism of our managers. They have the best authors and designers at their command. SVET International Publishing House is associated not only with the most effective advertising media. It is a great source of new ideas!</p>\n  </article>\n  <aside class="sun-times">\n    <div class="chicago-news text-center"><img src="img/aboutUs/aboutus_2.jpg"/></div>\n  </aside>\n</section>';});

define('text!jade/clientsPage.html',[],function () { return '\n<section class="svet-services">\n  <div class="h-services text-center">Our Clients</div>\n  <article>\n    <div class="clients-content">\n      <h2>Finance</h2>\n      <ul>\n        <li>MB Financial Bank</li>\n        <li>Harris Bank</li>\n        <li>ColeTaylor Bank</li>\n        <li>Devon Bank</li>\n        <li>Western Union</li>\n        <li>Bank Financial</li>\n        <li>Robbins & Lloyd Mortgage Corporation</li>\n        <li><em>And more...</em></li>\n      </ul>\n    </div>\n    <div class="clients-content">\n      <h2>Auto</h2>\n      <ul>\n        <li>Arlington Toyota</li>\n        <li>Berman’s Auto Group</li>\n        <li>Castle Honda</li>\n        <li>Fields Dodge and Jeep</li>\n        <li>Fields Infinity</li>\n        <li>Harley Davidson</li>\n        <li>Lexus of Orland</li>\n        <li>Prestige Leasing</li>\n        <li>Rich\'s Yamaha</li>\n        <li>Star Nissan</li>\n        <li><em>And more...</em></li>\n      </ul>\n    </div>\n    <div class="clients-content">\n      <h2>Stores</h2>\n      <ul>\n        <li>Studio 41 Home Design</li>\n        <li>Home Depot</li>\n        <li>C.D. Peacock</li>\n        <li>Fresh Farms</li>\n        <li>Highland Health Food</li>\n        <li>Garden Fresh</li>\n        <li>Farmers Best</li>\n        <li>H-Mart</li>\n        <li>Bende’s Specialty Foods</li>\n        <li>Jimenez</li>\n        <li><em>And more...</em></li>\n      </ul>\n    </div>\n  </article>\n  <article>\n    <div class="clients-content">\n      <h2>Restaurants</h2>\n      <ul>\n        <li>Maggiano’s</li>\n        <li>McCormick and Schmicks</li>\n        <li>Zhivago (Skokie)</li>\n        <li>Kamehachi (Chicago, Northbrook)</li>\n        <li>Gridley’s Grille (Long Grove)</li>\n        <li>Bella Via (Highland Park)</li>\n        <li>Dover Straits</li>\n        <li>Elephant (Niles)</li>\n        <li>Michael (Winnetka)</li>\n        <li>Le Titi De Paris (Arl Hts)</li>\n        <li>India House (Buffalo Grove)</li>\n        <li>Jimmy’s Charhouse (Riverwoods)</li>\n        <li>Omega (Niles)</li>\n        <li>Tapas Gitana (Northfield)</li>\n        <li>Raw Bar (Chicago)</li>\n        <li>Wild Fish (Arl Hts)</li>\n        <li>Brazzaz (Chicago)</li>\n        <li><em>And more...</em></li>\n      </ul>\n    </div>\n    <div class="clients-content">\n      <h2>Insurance</h2>\n      <ul>\n        <li>Allstate Insurance / Roman Sher</li>\n        <li>State Farm Insurance / Bonnie Perkovich</li>\n        <li>Country Insurance / Paul Moskvitin</li>\n        <li>Country Insurance / Yelena Sokolova</li>\n        <li>American Family insurance / Renata Tolvaisaite</li>\n        <li><em>And more...</em></li>\n      </ul>\n      <h2>Health</h2>\n      <ul>\n        <li>Pearle Vision</li>\n        <li>Women’s Health First</li>\n        <li>Gordin Medical Center</li>\n        <li>Rush North Shore Medical Center</li>\n        <li>IL Dental Center</li>\n        <li>North Shore Vascular</li>\n        <li>Mount Sinai Hospital</li>\n        <li>Dr. Elena Levitina</li>\n        <li>Healthy Trust<em>And more...</em></li>\n      </ul>\n    </div>\n    <div class="clients-content">\n      <h2>Attorneys</h2>\n      <ul>\n        <li>Davidson & Schiller, LLC</li>\n        <li>Chepov & Scott</li>\n        <li>Law Office of A. Gruzmark</li>\n        <li>Law Office of A. Liberfarb</li>\n        <li>DeFrenza, Moskoni Matyjewicz, P.C.</li>\n        <li>Birg & Meltser</li>\n        <li>Law office of A. Tolmatsky</li>\n        <li>Law Office of L. Golub</li>\n        <li>Law office of M. Kern</li>\n        <li> Slava A. Tenenbaum, chartered</li>\n        <li>Barry Rabovsky</li>\n        <li><em>And more...</em></li>\n      </ul>\n    </div>\n  </article>\n  <!--article-->\n  <!--    .clients-img-container-->\n  <!--        img(src="img/clients/clientsBEST.jpg")-->\n</section>';});

define('text!jade/radioPage.html',[],function () { return '\n<section class="svet-services">\n  <div class="h-services text-center">Radio "OSA"</div>\n  <div class="live-radio text-center"><a href="mms://medik.imcpro.com/svet_live"><img src="img/radio/radio_5.png"/></a>\n    <h2><a href="mms://medik.imcpro.com/svet_live">Live Translation</a></h2>\n  </div><br/>\n  <hr/><br/>\n  <h2>Archive 2014</h2>\n  <article>\n    <div class="radio-content-inline winter">\n      <h4>December</h4>\n      <p><a href="mms://strean.imcpro.com/svet/2014-12-28.asf">12.28.2014</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2014-12-21.asf">12.21.2014</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2014-12-14.asf">12.14.2014</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2014-12-07.asf">12.07.2014</a></p>\n    </div>\n    <div class="radio-content-inline fall">\n      <h4>November</h4>\n      <p><a href="mms://strean.imcpro.com/svet/2014-11-30.asf">11.30.2014</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2014-11-23.asf">11.23.2014</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2014-11-16.asf">11.16.2014</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2014-11-09.asf">11.09.2014</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2014-11-02.asf">11.02.2014</a></p>\n    </div>\n    <div class="radio-content-inline fall">\n      <h4>October</h4>\n      <p><a href="mms://strean.imcpro.com/svet/2014-10-26.asf">10.26.2014</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2014-10-19_001.asf">10.19.2014</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2014-10-19.asf">10.19.2014</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2014-10-12.asf">10.12.2014</a></p>\n    </div>\n    <div class="radio-content-inline fall">\n      <h4>September</h4>\n      <p><a href="mms://strean.imcpro.com/svet/2014-09-28.asf">09.28.2014</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2014-09-21.asf">09.21.2014</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2014-09-14.asf">09.14.2014</a></p>\n    </div>\n    <div class="radio-content-inline summer">\n      <h4>August</h4>\n      <p><a href="mms://strean.imcpro.com/svet/2014-08-31.asf">08.31.2014</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2014-08-24.asf">08.24.2014</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2014-08-17.asf">08.17.2014</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2014-08-10.asf">08.10.2014</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2014-08-03.asf">08.03.2014</a></p>\n    </div>\n    <div class="radio-content-inline summer">\n      <h4>July</h4>\n      <p><a href="mms://strean.imcpro.com/svet/2014-07-27.asf">07.27.2014</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2014-07-20.asf">07.20.2014</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2014-07-13_001.asf">07.13.2014</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2014-07-13.asf">07.13.2014</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2014-07-06.asf">07.06.2014</a></p>\n    </div>\n    <div class="radio-content-inline summer">\n      <h4>June</h4>\n      <p><a href="mms://strean.imcpro.com/svet/2014-06-29.asf">06.29.2014</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2014-06-22.asf">06.22.2014</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2014-06-15.asf">06.15.2014</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2014-06-08.asf">06.08.2014</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2014-06-01.asf">06.01.2014</a></p>\n    </div>\n    <div class="radio-content-inline spring">\n      <h4>May</h4>\n      <p><a href="mms://strean.imcpro.com/svet/2014-05-25.asf">05.25.2014</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2014-05-18.asf">05.18.2014</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2014-05-04.asf">05.04.2014</a></p>\n    </div>\n    <div class="radio-content-inline spring">\n      <h4>April</h4>\n      <p><a href="mms://strean.imcpro.com/svet/2014-04-27.asf">04.27.2014</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2014-04-21.asf">04.21.2014</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2014-04-20.asf">04.20.2014</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2014-04-13.asf">04.13.2014</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2014-04-06.asf">04.06.2014</a></p>\n    </div>\n    <div class="radio-content-inline spring">\n      <h4>March</h4>\n      <p><a href="mms://strean.imcpro.com/svet/2014-03-30.asf">03.30.2014</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2014-03-23.asf">03.23.2014</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2014-03-16.asf">03.16.2014</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2014-03-09.asf">03.09.2014</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2014-03-02.asf">03.02.2014</a></p>\n    </div>\n    <div class="radio-content-inline winter">\n      <h4>February</h4>\n      <p><a href="mms://strean.imcpro.com/svet/2014-02-23.asf">02.23.2014</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2014-02-16.asf">02.16.2014</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2014-02-09.asf">02.09.2014</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2014-02-02.asf">02.02.2014</a></p>\n    </div>\n    <div class="radio-content-inline winter">\n      <h4>January</h4>\n      <p><a href="mms://strean.imcpro.com/svet/2014-01-26.asf">01.26.2014</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2014-01-19.asf">01.19.2014</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2014-01-12.asf">01.12.2014</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2014-01-09.asf">01.09.2014</a></p>\n    </div>\n  </article>\n</section>\n<section class="svet-services"><br/>\n  <hr/><br/>\n  <h2>Archive 2013</h2>\n  <article>\n    <div class="radio-content-inline winter">\n      <h4>December</h4>\n      <p><a href="mms://strean.imcpro.com/svet/2013-12-29.asf">12.29.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-12-22.asf">12.22.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-12-15.asf">12.15.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-12-08.asf">12.08.2013</a></p>\n    </div>\n    <div class="radio-content-inline fall">\n      <h4>November</h4>\n      <p><a href="mms://strean.imcpro.com/svet/2013-11-24.asf">11.24.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-11-17_001.asf">11.17.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-11-17.asf">11.17.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-11-10_002.asf">11.10.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-11-10_001.asf">11.10.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-11-10.asf">11.10.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-11-03.asf">11.03.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-11-03_002.asf">11.03.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-11-03_001.asf">11.03.2013</a></p>\n    </div>\n    <div class="radio-content-inline fall">\n      <h4>October</h4>\n      <p><a href="mms://strean.imcpro.com/svet/2013-10-27.asf">10.27.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-10-20_001.asf">10.20.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-10-20.asf">10.20.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-10-13.asf">10.13.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-10-06_002.asf">10.06.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-10-06_001.asf">10.06.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-10-06.asf">10.06.2013</a></p>\n    </div>\n    <div class="radio-content-inline fall">\n      <h4>September</h4>\n      <p><a href="mms://strean.imcpro.com/svet/2013-09-29.asf">09.29.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-09-22.asf">09.22.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-09-22_001.asf">09.22.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-09-22_002.asf">09.22.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-09-15.asf">09.15.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-09-08_001.asf">09.08.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-09-08.asf">09.08.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-09-08_002.asf">09.08.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-09-01_003.asf">09.01.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-09-01_002.asf">09.01.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-09-01_001.asf">09.01.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-09-01.asf">09.01.2013</a></p>\n    </div>\n    <div class="radio-content-inline summer">\n      <h4>August</h4>\n      <p><a href="mms://strean.imcpro.com/svet/2013-08-25.asf">08.25.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-08-25_001.asf">08.25.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-08-25_003.asf">08.25.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-08-25_002.asf">08.25.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-08-18_002.asf">08.18.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-08-18_001.asf">08.18.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-08-18.asf">08.18.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-08-11_003.asf">08.11.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-08-11_002.asf">08.11.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-08-11_001.asf">08.11.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-08-11.asf">08.11.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-08-04.asf">08.04.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-08-04_002.asf">08.04.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-08-04_001.asf">08.04.2013</a></p>\n    </div>\n    <div class="radio-content-inline summer">\n      <h4>July</h4>\n      <p><a href="mms://strean.imcpro.com/svet/2013-07-30.asf">07.30.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-07-22.asf">07.22.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-07-14.asf">07.14.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-07-14_001.asf">07.14.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-07-08.asf">07.08.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-07-07_001.asf">07.07.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-07-07.asf">07.07.2013</a></p>\n    </div>\n    <div class="radio-content-inline summer">\n      <h4>June</h4>\n      <p><a href="mms://strean.imcpro.com/svet/2013-06-30_001.asf">06.30.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-06-30.asf">06.30.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-06-23.asf">06.23.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-06-16.asf">06.16.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-06-09.asf">06.09.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-06-02.asf">06.02.2013</a></p>\n    </div>\n    <div class="radio-content-inline spring">\n      <h4>May</h4>\n      <p><a href="mms://strean.imcpro.com/svet/2013-05-26.asf">05.26.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-05-20.asf">05.20.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-05-20_001.asf">05.20.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-05-19.asf">05.19.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-05-12.asf">05.12.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-05-06.asf">05.06.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-05-02.asf">05.02.2013</a></p>\n    </div>\n    <div class="radio-content-inline spring">\n      <h4>April</h4>\n      <p><a href="mms://strean.imcpro.com/svet/2013-04-30.asf">04.30.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-04-29.asf">04.29.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-04-29_001.asf">04.29.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-04-29_002.asf">04.29.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-04-29_004.asf">04.29.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-04-29_003.asf">04.29.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-04-29_005.asf">04.29.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-04-28.asf">04.28.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-04-25_002.asf">04.25.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-04-25_001.asf">04.25.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-04-25.asf">04.25.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-04-21_001.asf">04.21.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-04-21.asf">04.21.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-04-14.asf">04.14.2013</a></p>\n    </div>\n    <div class="radio-content-inline spring">\n      <h4>March</h4>\n      <p><a href="mms://strean.imcpro.com/svet/2013-03-10.asf">03.10.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-03-10_001.asf">03.10.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-03-03_002.asf">03.03.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-03-03_001.asf">03.03.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-03-03.asf">03.03.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-03-03_003.asf">03.03.2013</a></p>\n    </div>\n    <div class="radio-content-inline winter">\n      <h4>February</h4>\n      <p><a href="mms://strean.imcpro.com/svet/2013-02-24.asf">02.24.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-02-17.asf">02.17.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-02-10.asf">02.10.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-02-03.asf">02.03.2013</a></p>\n    </div>\n    <div class="radio-content-inline winter">\n      <h4>January</h4>\n      <p><a href="mms://strean.imcpro.com/svet/2013-01-27.asf">01.27.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-01-20.asf">01.20.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-01-13.asf">01.13.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-01-06.asf">01.06.2013</a></p>\n    </div>\n  </article>\n</section>';});

define('text!jade/contactUsPage.html',[],function () { return '\n<section class="svet-services">\n  <div class="h-services text-center">Contact Us</div><br/>\n  <article class="dem-content-bottom">\n    <table width="220" border="0" cellspacing="0" cellpadding="0" style="margin-top:10px;" class="simpleText">\n      <tbody>\n        <tr>\n          <td> </td>\n          <td colspan="2">900 Skokie Blvd., Suite 103, Northbrook, IL 60062<br/>Tel. (847)715-9407<br/>Fax: (847)715-9677<br/>E-mail:<a href="mailto:svet@svet.com" class="menu2"> manager@svet.com</a></td>\n        </tr>\n        <tr>\n          <td colspan="3" height="8"></td>\n        </tr>\n      </tbody>\n    </table>\n  </article>\n</section>';});

define('views/HomeScroll',['require','exports','module','famous/core/Surface','famous/core/Modifier','famous/core/Transform','famous/core/View','famous/views/ScrollContainer','famous/core/ViewSequence','famous/modifiers/StateModifier','famous/core/EventHandler','d3/d3','views/DemographicView','text!jade/homePage.html','text!jade/aboutUsPage.html','text!jade/clientsPage.html','text!jade/radioPage.html','text!jade/contactUsPage.html'],function (require, exports, module) {
    var Surface = require('famous/core/Surface');
    var Modifier = require('famous/core/Modifier');
    var Transform = require('famous/core/Transform');
    var View = require('famous/core/View');
    var ScrollContainer = require('famous/views/ScrollContainer');
    var ViewSequence = require('famous/core/ViewSequence');
    var StateModifier = require('famous/modifiers/StateModifier');
    var EventHandler = require('famous/core/EventHandler');

    var d3 = require('d3/d3');
    var DemographicView = require('views/DemographicView');


    function HomeScroll(sync) {
        this.generalSync = sync;
        this.eventInput = new EventHandler();
        /*Assign an event handler to receive an object's input events.*/
        EventHandler.setInputHandler(this, this.eventInput);

        this.eventInput.on('pageChange', function (index) {
            alert(index);
        })

        ScrollContainer.apply(this, arguments);
        _createContent.call(this);

        this.scrollview.setOptions({
            pageSwitchSpeed: 0.2,
            paginated: true,
            friction: 0.005,
            drag: 0.0001,
            edgeGrip: 0.2,
            edgePeriod: 300,
            edgeDamp: 1,
            speedLimit: 1,
            margin: 5330
        })
    }

    HomeScroll.prototype = Object.create(ScrollContainer.prototype);
    HomeScroll.prototype.constructor = HomeScroll;

    HomeScroll.DEFAULT_OPTIONS = {};

    function _createContent() {
        var that = this;
        var genericSync = this.generalSync;

        var homePage = require('text!jade/homePage.html');
        var aboutUsPage = require('text!jade/aboutUsPage.html');
        this.demographicsPage = new DemographicView(genericSync);

        var clientsPage = require('text!jade/clientsPage.html');
        var radioPage = require('text!jade/radioPage.html');
        var contactUsPage = require('text!jade/contactUsPage.html');


        this.contents = [];

        this.contentHome = new Surface({
            size: [undefined, undefined],
            content: homePage,
            properties: {
                fontSize: '16px',
                backgroundColor: '#FFE1D0'
            }
        });
        this.contentAbout = new Surface({
            size: [undefined, undefined],
            content: aboutUsPage,
            properties: {
                backgroundColor: '#E6FFEF'
            }
        });


        this.contentClients = new Surface({
            size: [undefined, undefined],
            content: clientsPage,
            properties: {
                backgroundColor: '#E6FFDB'
            }
        });
        this.contentRadio = new Surface({
            size: [undefined, undefined],
            content: radioPage,
            properties: {
                backgroundColor: '#FFF1E9'
            }
        });
        this.contentContact = new Surface({
            size: [undefined, undefined],
            content: contactUsPage,
            properties: {
                backgroundColor: '#FFE1D0'
            }
        });

        this.contentHome.pipe(genericSync);
        this.contentAbout.pipe(genericSync);
        this.demographicsPage.pipe(genericSync);
        this.contentClients.pipe(genericSync);
        this.contentRadio.pipe(genericSync);
        this.contentContact.pipe(genericSync);

        genericSync.on("start", function () {
        });

        genericSync.on("update", function (data) {
            delta = data.delta[1];
            if (delta < 0) {
                that.scrollview.goToNextPage();
            } else {

                that.scrollview.goToPreviousPage();
            }
        });

        genericSync.on("end", function () {

        });

        this.contents.push(this.demographicsPage);
        this.contents.push(this.contentHome);
        this.contents.push(this.contentAbout);
        this.contents.push(this.contentClients);
        this.contents.push(this.contentRadio);
        this.contents.push(this.contentContact);
        this.sequenceFrom(this.contents);

    };

    module.exports = HomeScroll;
});

define('views/HeaderView',['require','exports','module','famous/core/Surface','famous/core/Modifier','famous/core/Transform','famous/core/View'],function (require, exports, module) {
    var Surface = require('famous/core/Surface');
    var Modifier = require('famous/core/Modifier');
    var Transform = require('famous/core/Transform');
    var View = require('famous/core/View');

    function HeaderView() {
        View.apply(this, arguments);

        _createHeader.call(this);
        _setListeners.call(this);
    }

    HeaderView.prototype = Object.create(View.prototype);
    HeaderView.prototype.constructor = HeaderView;

    function _createHeader() {
        var backgroundSurface = new Surface({
            size: [undefined, undefined],
            properties: {
                // coloring pink, but background should not be visible anyway when viewed at device screen size
                backgroundColor: '#FC6E51'
                //backgroundColor: '#C8645B'
            }
        });

        this.hamburgerSurface = new Surface({
            size: [53, undefined],
            content: '<img width="53" src="../../img/hamburger-template.png"/>',

            properties: {
                zIndex: '10'
            }
        });


        this.titleSurface = new Surface({
            size: [undefined, undefined],
            content: 'SVET Media Group',
            properties: {
                fontSize: '22px',
                textAlign: 'center',
                color: "white",
                lineHeight: "50px",
                fontWeight: '700',
                backgroundColor: '#FC6E51'
            }
        });

        this.hamburgerModifier = new Modifier({
            transform: Transform.translate(0, 0, 2)
        });

        this.bgModifier = new Modifier({
            transform: Transform.translate(0, 0, 1)
        });

        this.titleModifier = new Modifier({
            transform: Transform.translate(0, 0, 1),
            origin: [0.5, 0],
            align: [0.5, 0]
        });

        this._add(this.titleModifier).add(this.titleSurface);
        this._add(this.hamburgerModifier).add(this.hamburgerSurface);

        this._add(backgroundSurface);
    }

    function _setListeners() {
        this.hamburgerSurface.on('touchstart', function () {
            this.hamburgerModifier.setOpacity(0.5);
        }.bind(this));

        this.hamburgerSurface.on('mousedown', function () {
            this.hamburgerModifier.setOpacity(0.5);
        }.bind(this));

        this.hamburgerSurface.on('click', function () {
            this.hamburgerModifier.setOpacity(1);
            this._eventOutput.emit('menuToggle');
        }.bind(this));
    }

    module.exports = HeaderView;
});

define('views/PageView',['require','exports','module','d3/d3','famous/core/Surface','famous/core/Modifier','famous/core/Transform','famous/core/View','views/HomeScroll','famous/views/HeaderFooterLayout','famous/views/GridLayout','views/HeaderView','text!jade/homePage.html','text!jade/aboutUsPage.html','text!jade/demographicsPage.html','text!jade/clientsPage.html','text!jade/radioPage.html','famous/inputs/GenericSync','famous/inputs/MouseSync','famous/inputs/TouchSync','famous/inputs/ScrollSync','famous/core/Transform','famous/transitions/Transitionable'],function (require, exports, module) {

    var d3            = require('d3/d3');
    var Surface = require('famous/core/Surface');
    var Modifier = require('famous/core/Modifier');
    var Transform = require('famous/core/Transform');
    var View = require('famous/core/View');
    var HomeScroll = require('views/HomeScroll');
    var HeaderFooterLayout = require('famous/views/HeaderFooterLayout');
    var GridLayout = require("famous/views/GridLayout");

    var HeaderView = require('views/HeaderView');
    var homePage = require('text!jade/homePage.html');
    var aboutUsPage = require('text!jade/aboutUsPage.html');
    var demographicsPage = require('text!jade/demographicsPage.html');
    var clientsPage = require('text!jade/clientsPage.html');
    var radioPage = require('text!jade/radioPage.html');

    var GenericSync = require("famous/inputs/GenericSync");
    var MouseSync = require("famous/inputs/MouseSync");
    var TouchSync = require("famous/inputs/TouchSync");
    var ScrollSync = require("famous/inputs/ScrollSync");

    var Transform = require('famous/core/Transform');
    var Transitionable = require('famous/transitions/Transitionable');


    function PageView() {
        var that = this;

        GenericSync.register({
            touch: TouchSync,
            scroll: ScrollSync
        });

        var genericSync = new GenericSync(['mouse', 'touch', 'scroll']);

        View.apply(this, arguments);

        this.layout = new HeaderFooterLayout({
            headerSize: 50,
            footerSize: 50
        });

        /*Header*/
        this.header = new HeaderView();
        this.header.pipe(this);

        /*Content*/
        this.content = new HomeScroll(genericSync);
        this.content.pipe(this);

        var currentIndex = 0;
        var part = 1 / 6;
        var prevElement, prevElementTemp,
            currentElement, currentElementTemp, direction;
        genericSync.on("update", function (data) {
            delta = data.delta[1];
            if (delta < 0) {
                direction = -1;
                currentIndex++;
            } else {
                currentIndex--;
                direction = 1;
            }

            if (currentIndex > 5) {
                currentIndex = 5;
            }
            if (currentIndex < 0) {
                currentIndex = 0;
            }

            try {
                prevElementTemp = that.states[currentIndex + direction];
            } catch (e) {
                prevElementTemp = null;
            }
            if (prevElementTemp !== null && prevElementTemp !== prevElement) {
                prevElement = prevElementTemp;
                prevElement.set(0, {duration: 100});
            }

            currentElementTemp = that.states[currentIndex];
            if (currentElementTemp !== currentElement) {
                currentElement = currentElementTemp;
                currentElement.set(1, {duration: 200});

            }

        });

        /* =Footer*/
        this.footers = [];
        this.footer = new GridLayout({
            dimensions: [3, 1]
        });
        this.footer.pipe(this);

        this.footerLeft = new Surface({
            size: [undefined, undefined],
            properties: {
                backgroundSize: 'cover'
            }
        })

        this.footerCenter = new Surface({
            size: [undefined, undefined],
            properties: {
                backgroundSize: 'cover'
            }
        })

        this.footerRight = new Surface({
            size: [undefined, undefined],
            properties: {
                //backgroundColor: '#F27649',
                backgroundSize: 'cover'
            }
        })
        this.footers.push(this.footerLeft);

        this.footers.push(this.footerCenter);
        this.footers.push(this.footerRight);
        this.footer.sequenceFrom(this.footers);

        this.layout.content.add(this.content);
        this.layout.header.add(this.header);

        this.state1 = new Transitionable(1);
        this.modifier1 = new Modifier({
            opacity: function () {
                return that.state1.get();
            }
        });
        this.surface1 = new Surface({
            size: [undefined, undefined],
            properties: {
                backgroundColor: 'purple'
            }
        });

        this.state2 = new Transitionable(0);
        this.modifier2 = new Modifier({
            opacity: function () {
                return that.state2.get();
            }
        });
        this.surface2 = new Surface({
            size: [undefined, undefined],
            properties: {
                backgroundColor: 'green'
            }
        });

        this.state3 = new Transitionable(0);
        this.modifier3 = new Modifier({
            opacity: function () {
                return that.state3.get();
            }
        });
        this.surface3 = new Surface({
            size: [undefined, undefined],
            properties: {
                backgroundColor: 'red'
            }
        });

        this.state4 = new Transitionable(0);
        this.modifier4 = new Modifier({
            opacity: function () {
                return that.state4.get();
            }
        });
        this.surface4 = new Surface({
            size: [undefined, undefined],
            properties: {
                backgroundColor: 'yellow'
            }
        });

        this.state5 = new Transitionable(0);
        this.modifier5 = new Modifier({
            opacity: function () {
                return that.state5.get();
            }
        });
        this.surface5 = new Surface({
            size: [undefined, undefined],
            properties: {
                backgroundColor: 'brown'
            }
        });

        this.state6 = new Transitionable(0);
        this.modifier6 = new Modifier({
            opacity: function () {
                return that.state6.get();
            }
        });
        this.surface6 = new Surface({
            size: [undefined, undefined],
            properties: {
                backgroundColor: 'blue'
            }
        });
        this.states = [];
        this.states.push(this.state1);
        this.states.push(this.state2);
        this.states.push(this.state3);
        this.states.push(this.state4);
        this.states.push(this.state5);
        this.states.push(this.state6);

        this.layout.footer.add(this.modifier1).add(this.surface1).add(this.footer);
        this.layout.footer.add(this.modifier2).add(this.surface2).add(this.footer);
        this.layout.footer.add(this.modifier3).add(this.surface3).add(this.footer);
        this.layout.footer.add(this.modifier4).add(this.surface4).add(this.footer);
        this.layout.footer.add(this.modifier5).add(this.surface5).add(this.footer);
        this.layout.footer.add(this.modifier6).add(this.surface6).add(this.footer);

        this._eventInput.pipe(this._eventOutput);

        this.add(this.layout);
    }

    PageView.prototype = Object.create(View.prototype);
    PageView.prototype.constructor = PageView;

    PageView.prototype.navigateTo = function (index) {
        for (var i = 0; i < this.states.length; i++) {
            var state = this.states[i];
            state.set(0);
        }
        var navigatedState = this.states[index];
        navigatedState.set(1, {duration: 300});
        this.content.scrollview.goToPage(index);
    }

    module.exports = PageView;

})
;

define('views/AppView',['require','exports','module','famous/core/Surface','famous/core/Modifier','famous/core/Transform','famous/core/View','famous/inputs/MouseSync','famous/inputs/GenericSync','famous/transitions/Transitionable','famous/views/HeaderFooterLayout','famous/core/EventHandler','./MenuView','./PageView'],function (require, exports, module) {
    var Surface = require('famous/core/Surface');
    var Modifier = require('famous/core/Modifier');
    var Transform = require('famous/core/Transform');
    var View = require('famous/core/View');
    var MouseSync = require('famous/inputs/MouseSync');
    var GenericSync = require('famous/inputs/GenericSync');
    var Transitionable = require('famous/transitions/Transitionable');
    var HeaderFooterLayout = require('famous/views/HeaderFooterLayout');

    var EventHandler = require('famous/core/EventHandler');
    var MenuView = require('./MenuView');
    var PageView = require('./PageView');

    function AppView() {
        var that = this;
        View.apply(this, arguments);
        this.menuToggle = false;
        this.eventInput = new EventHandler();
        EventHandler.setInputHandler(this, this.eventInput);
        this.menuView = new MenuView();
        this.menuView.pipe(this);

        this.pageView = new PageView();
        this.pageViewPos = new Transitionable(0);

        this.eventInput.on('navigateTo', function (index) {
            that.pageView.navigateTo(index);
       })
        this.pageModifier = new Modifier();

        this.pageModifier.transformFrom(function () {
            return Transform.translate(this.pageViewPos.get(), 0, 0);
        }.bind(this));

        this.pageView.on('menuToggle', this.toggleMenu.bind(this));

        this.add(this.menuView);
        this.add(this.pageModifier).add(this.pageView);

        _handleTouch.call(this);
    }

    AppView.prototype = Object.create(View.prototype);
    AppView.prototype.constructor = AppView;

    AppView.DEFAULT_OPTIONS = {
        posThreshold: 95.5,
        velThreshold: 0.75,
        transition: {
            duration: 300,
            curve: 'easeOut'
        },
        maxOpenPos: 191
    };

    function _handleTouch() {
        GenericSync.register(MouseSync);
        this.sync = new GenericSync(function () {
            return this.pageViewPos.get(0);
        }.bind(this), {direction: GenericSync.DIRECTION_X});

        this.pageView.pipe(this.sync);

        this.sync.on('update', function (data) {
            if (this.pageViewPos.get() === 0 && data.position > 0) {
                this.menuView.animateNavItems();
            }

            this.pageViewPos.set(Math.min(Math.max(0, data.position), this.options.maxOpenPos));
        }.bind(this));

        this.sync.on('end', (function (data) {
            var velocity = data.velocity;
            var position = this.pageViewPos.get();

            if (this.pageViewPos.get() > this.options.posThreshold) {
                if (velocity < -this.options.velThreshold) {
                    this.slideLeft();
                } else {
                    this.slideRight();
                }
            } else {
                if (velocity > this.options.velThreshold) {
                    this.slideRight();
                } else {
                    this.slideLeft();
                }
            }
        }).bind(this));
    }

    AppView.prototype.toggleMenu = function () {
        if (this.menuToggle) {
            this.slideLeft();
        } else {
            this.slideRight();
            this.menuView.animateNavItems();
        }
        this.menuToggle = !this.menuToggle;
    };

    AppView.prototype.slideLeft = function () {
        this.pageViewPos.set(0, this.options.transition, function () {
            this.menuToggle = false;
        }.bind(this));
    };

    AppView.prototype.slideRight = function () {
        this.pageViewPos.set(this.options.maxOpenPos, this.options.transition, function () {
            this.menuToggle = true;
        }.bind(this));
    };

    module.exports = AppView;
});

define('main',['require', 'famous/core/Engine', 'views/AppView'], function (require, Engine, AppView) {

    var Transform = require('famous/core/Transform');
    var mainContext = Engine.createContext();



    var appView = new AppView();


    mainContext.add(appView);
});

define("main", function(){});

define(function (require, exports, module) {
    var Surface = require('famous/core/Surface');
    var Modifier = require('famous/core/Modifier');
    var Transform = require('famous/core/Transform');
    var View = require('famous/core/View');
    var MouseSync = require('famous/inputs/MouseSync');
    var GenericSync = require('famous/inputs/GenericSync');
    var Transitionable = require('famous/transitions/Transitionable');
    var HeaderFooterLayout = require('famous/views/HeaderFooterLayout');

    var EventHandler = require('famous/core/EventHandler');
    var MenuView = require('./MenuView');
    var PageView = require('./PageView');

    function AppView() {
        var that = this;
        View.apply(this, arguments);
        this.menuToggle = false;
        this.eventInput = new EventHandler();
        EventHandler.setInputHandler(this, this.eventInput);
        this.menuView = new MenuView();
        this.menuView.pipe(this);

        this.pageView = new PageView();
        this.pageViewPos = new Transitionable(0);

        this.eventInput.on('navigateTo', function (index) {
            that.pageView.navigateTo(index);
       })
        this.pageModifier = new Modifier();

        this.pageModifier.transformFrom(function () {
            return Transform.translate(this.pageViewPos.get(), 0, 0);
        }.bind(this));

        this.pageView.on('menuToggle', this.toggleMenu.bind(this));

        this.add(this.menuView);
        this.add(this.pageModifier).add(this.pageView);

        _handleTouch.call(this);
    }

    AppView.prototype = Object.create(View.prototype);
    AppView.prototype.constructor = AppView;

    AppView.DEFAULT_OPTIONS = {
        posThreshold: 95.5,
        velThreshold: 0.75,
        transition: {
            duration: 300,
            curve: 'easeOut'
        },
        maxOpenPos: 191
    };

    function _handleTouch() {
        GenericSync.register(MouseSync);
        this.sync = new GenericSync(function () {
            return this.pageViewPos.get(0);
        }.bind(this), {direction: GenericSync.DIRECTION_X});

        this.pageView.pipe(this.sync);

        this.sync.on('update', function (data) {
            if (this.pageViewPos.get() === 0 && data.position > 0) {
                this.menuView.animateNavItems();
            }

            this.pageViewPos.set(Math.min(Math.max(0, data.position), this.options.maxOpenPos));
        }.bind(this));

        this.sync.on('end', (function (data) {
            var velocity = data.velocity;
            var position = this.pageViewPos.get();

            if (this.pageViewPos.get() > this.options.posThreshold) {
                if (velocity < -this.options.velThreshold) {
                    this.slideLeft();
                } else {
                    this.slideRight();
                }
            } else {
                if (velocity > this.options.velThreshold) {
                    this.slideRight();
                } else {
                    this.slideLeft();
                }
            }
        }).bind(this));
    }

    AppView.prototype.toggleMenu = function () {
        if (this.menuToggle) {
            this.slideLeft();
        } else {
            this.slideRight();
            this.menuView.animateNavItems();
        }
        this.menuToggle = !this.menuToggle;
    };

    AppView.prototype.slideLeft = function () {
        this.pageViewPos.set(0, this.options.transition, function () {
            this.menuToggle = false;
        }.bind(this));
    };

    AppView.prototype.slideRight = function () {
        this.pageViewPos.set(this.options.maxOpenPos, this.options.transition, function () {
            this.menuToggle = true;
        }.bind(this));
    };

    module.exports = AppView;
});

define(function (require, exports, module) {
    var Surface = require('famous/core/Surface');
    var Modifier = require('famous/core/Modifier');
    var Transform = require('famous/core/Transform');
    var View = require('famous/core/View');
    var GridLayout = require('famous/views/GridLayout');
    var Timer = require('famous/utilities/Timer');
    var EventHandler = require('famous/core/EventHandler');
    var LanguagePieView = require('views/LanguagePieView');


    function DemographicView(genericSync) {
        var that = this;
        View.apply(this, arguments);

        this.eventInput = new EventHandler();
        this.eventOutput = new EventHandler();
        EventHandler.setInputHandler(this, this.eventInput);
        EventHandler.setOutputHandler(this, this.eventOutput);

        var demographicsPart1 = require('text!jade/demographicsPage.html');
        var demographicsPart2 = require('text!jade/demographicsPart2.html');

        this.contentPart1 = new Surface({
            size: [undefined, undefined],
            content: demographicsPart1,
            properties: {
                backgroundColor: '#FFFAE2'
            }
        });
        this.languagePieView = new LanguagePieView(genericSync);

        this.contentPart3 = new Surface({
            size: [undefined, undefined],
            content: demographicsPart2,
            properties: {
                backgroundColor: '#FFFAE2'
            }
        });
        var demographContent = [];
        demographContent.push(this.contentPart1);
        demographContent.push(this.languagePieView);
        demographContent.push(this.contentPart3);

        var grid = new GridLayout({
            direction: 1,
            dimensions: [1, 3]
        });
        grid.sequenceFrom(demographContent);

        this.add(grid);

        this.contentPart1.pipe(genericSync);
        this.contentPart3.pipe(genericSync);

    }


    DemographicView.prototype = Object.create(View.prototype);
    DemographicView.prototype.constructor = DemographicView;


    DemographicView.DEFAULT_OPTIONS = {};


    module.exports = DemographicView;
});

define(function (require, exports, module) {
    var Surface = require('famous/core/Surface');
    var Modifier = require('famous/core/Modifier');
    var Transform = require('famous/core/Transform');
    var View = require('famous/core/View');

    function HeaderView() {
        View.apply(this, arguments);

        _createHeader.call(this);
        _setListeners.call(this);
    }

    HeaderView.prototype = Object.create(View.prototype);
    HeaderView.prototype.constructor = HeaderView;

    function _createHeader() {
        var backgroundSurface = new Surface({
            size: [undefined, undefined],
            properties: {
                // coloring pink, but background should not be visible anyway when viewed at device screen size
                backgroundColor: '#FC6E51'
                //backgroundColor: '#C8645B'
            }
        });

        this.hamburgerSurface = new Surface({
            size: [53, undefined],
            content: '<img width="53" src="../../img/hamburger-template.png"/>',

            properties: {
                zIndex: '10'
            }
        });


        this.titleSurface = new Surface({
            size: [undefined, undefined],
            content: 'SVET Media Group',
            properties: {
                fontSize: '22px',
                textAlign: 'center',
                color: "white",
                lineHeight: "50px",
                fontWeight: '700',
                backgroundColor: '#FC6E51'
            }
        });

        this.hamburgerModifier = new Modifier({
            transform: Transform.translate(0, 0, 2)
        });

        this.bgModifier = new Modifier({
            transform: Transform.translate(0, 0, 1)
        });

        this.titleModifier = new Modifier({
            transform: Transform.translate(0, 0, 1),
            origin: [0.5, 0],
            align: [0.5, 0]
        });

        this._add(this.titleModifier).add(this.titleSurface);
        this._add(this.hamburgerModifier).add(this.hamburgerSurface);

        this._add(backgroundSurface);
    }

    function _setListeners() {
        this.hamburgerSurface.on('touchstart', function () {
            this.hamburgerModifier.setOpacity(0.5);
        }.bind(this));

        this.hamburgerSurface.on('mousedown', function () {
            this.hamburgerModifier.setOpacity(0.5);
        }.bind(this));

        this.hamburgerSurface.on('click', function () {
            this.hamburgerModifier.setOpacity(1);
            this._eventOutput.emit('menuToggle');
        }.bind(this));
    }

    module.exports = HeaderView;
});

define(function (require, exports, module) {
    var Surface = require('famous/core/Surface');
    var Modifier = require('famous/core/Modifier');
    var Transform = require('famous/core/Transform');
    var View = require('famous/core/View');
    var ScrollContainer = require('famous/views/ScrollContainer');
    var ViewSequence = require('famous/core/ViewSequence');
    var StateModifier = require('famous/modifiers/StateModifier');
    var EventHandler = require('famous/core/EventHandler');

    var d3 = require('d3/d3');
    var DemographicView = require('views/DemographicView');


    function HomeScroll(sync) {
        this.generalSync = sync;
        this.eventInput = new EventHandler();
        /*Assign an event handler to receive an object's input events.*/
        EventHandler.setInputHandler(this, this.eventInput);

        this.eventInput.on('pageChange', function (index) {
            alert(index);
        })

        ScrollContainer.apply(this, arguments);
        _createContent.call(this);

        this.scrollview.setOptions({
            pageSwitchSpeed: 0.2,
            paginated: true,
            friction: 0.005,
            drag: 0.0001,
            edgeGrip: 0.2,
            edgePeriod: 300,
            edgeDamp: 1,
            speedLimit: 1,
            margin: 5330
        })
    }

    HomeScroll.prototype = Object.create(ScrollContainer.prototype);
    HomeScroll.prototype.constructor = HomeScroll;

    HomeScroll.DEFAULT_OPTIONS = {};

    function _createContent() {
        var that = this;
        var genericSync = this.generalSync;

        var homePage = require('text!jade/homePage.html');
        var aboutUsPage = require('text!jade/aboutUsPage.html');
        this.demographicsPage = new DemographicView(genericSync);

        var clientsPage = require('text!jade/clientsPage.html');
        var radioPage = require('text!jade/radioPage.html');
        var contactUsPage = require('text!jade/contactUsPage.html');


        this.contents = [];

        this.contentHome = new Surface({
            size: [undefined, undefined],
            content: homePage,
            properties: {
                fontSize: '16px',
                backgroundColor: '#FFE1D0'
            }
        });
        this.contentAbout = new Surface({
            size: [undefined, undefined],
            content: aboutUsPage,
            properties: {
                backgroundColor: '#E6FFEF'
            }
        });


        this.contentClients = new Surface({
            size: [undefined, undefined],
            content: clientsPage,
            properties: {
                backgroundColor: '#E6FFDB'
            }
        });
        this.contentRadio = new Surface({
            size: [undefined, undefined],
            content: radioPage,
            properties: {
                backgroundColor: '#FFF1E9'
            }
        });
        this.contentContact = new Surface({
            size: [undefined, undefined],
            content: contactUsPage,
            properties: {
                backgroundColor: '#FFE1D0'
            }
        });

        this.contentHome.pipe(genericSync);
        this.contentAbout.pipe(genericSync);
        this.demographicsPage.pipe(genericSync);
        this.contentClients.pipe(genericSync);
        this.contentRadio.pipe(genericSync);
        this.contentContact.pipe(genericSync);

        genericSync.on("start", function () {
        });

        genericSync.on("update", function (data) {
            delta = data.delta[1];
            if (delta < 0) {
                that.scrollview.goToNextPage();
            } else {

                that.scrollview.goToPreviousPage();
            }
        });

        genericSync.on("end", function () {

        });

        this.contents.push(this.demographicsPage);
        this.contents.push(this.contentHome);
        this.contents.push(this.contentAbout);
        this.contents.push(this.contentClients);
        this.contents.push(this.contentRadio);
        this.contents.push(this.contentContact);
        this.sequenceFrom(this.contents);

    };

    module.exports = HomeScroll;
});

define(function (require, exports, module) {
    var Surface = require('famous/core/Surface');
    var Modifier = require('famous/core/Modifier');
    var Transform = require('famous/core/Transform');
    var View = require('famous/core/View');
    var FlexibleLayout = require('famous/views/FlexibleLayout');
    var Timer = require('famous/utilities/Timer');
    var EventHandler = require('famous/core/EventHandler');

    var Transitionable = require('famous/transitions/Transitionable');


    function LanguagePieView(genericSync) {
        var that = this;
        View.apply(this, arguments);

        this.eventInput = new EventHandler();
        this.eventOutput = new EventHandler();
        EventHandler.setInputHandler(this, this.eventInput);
        EventHandler.setOutputHandler(this, this.eventOutput);

        var flex = new FlexibleLayout({
            ratios: [2, 10]
        });
        var windowWidth = window.innerWidth;
        var windowHeight = window.innerHeight;
        var widthScale = 0.82;
        var svgScale = 0.1;
        this.contentWidth = widthScale * windowWidth;
        this.svgWidth = Math.floor(svgScale * windowWidth);
        var svgLanguage = _createLanguageSvg(this.svgWidth);

        var transWidth = new Transitionable([this.contentWidth, 100]);
        window.onresize = function () {
            windowWidth = window.innerWidth;
        }


        this.languageModifier = new Modifier({
            size: transWidth.get(),
            transform: Transform.translate(0, 0, 10),
            origin: [0.5, 0],
            align: [0.5, 0]
        });
        this.svgLanguage = new Surface({
            size: [undefined, undefined],
            content: svgLanguage,
            properties: {
                fontSize: '11px',
                zIndex: 10
            }
        });

        this.textLanguage = new Surface({
            size: [undefined, undefined],
            content: '<h2> Language</h2><p>Ukrainian, Lithuanian, Bulgarian, and other Eastern European communities speak Russian, which makes the Russian speaking community the second largest segment of the foreign born US population, which is estimated at 5 million people.</p>',
            properties: {
                zIndex: 10
            }
        });
        var languageContent = [];
        languageContent.push(this.svgLanguage);
        languageContent.push(this.textLanguage);
        flex.sequenceFrom(languageContent);

        this.bgColor = new Surface({
            size: [undefined, undefined],
            properties: {
                backgroundColor: '#FFFAE2'
            }

        });
        this.svgLanguage.pipe(genericSync);
        this.add(this.bgColor);
        this.add(this.languageModifier).add(flex);
    }

    function _createLanguageSvg(width) {
        var svgLanguage = document.createElementNS(d3.ns.prefix.svg, 'svg');

        var w = width;
        var h = w;
        var r = h / 2;
        var color = d3.scale.category20c();
        var data = [{"label": "Russian", "value": 20},
            {"label": "Hispanic", "value": 50},
            {"label": "Others", "value": 30}];
        var vis = d3.select(svgLanguage).data([data]).attr("width", w).attr("height", h).append("svg:g").attr("transform", "translate(" + r + "," + r + ")");
        var pie = d3.layout.pie().value(function (d) {
            return d.value;
        });

        var arc = d3.svg.arc().outerRadius(r);

        var arcs = vis.selectAll("g.slice").data(pie).enter().append("svg:g").attr("class", "slice");
        arcs.append("svg:path")
            .attr("fill", function (d, i) {
                return color(i);
            })
            .attr("d", function (d) {
                return arc(d);
            });

        arcs.append("svg:text").attr("transform", function (d) {
            d.innerRadius = 0;
            d.outerRadius = r;
            return "translate(" + arc.centroid(d) + ")";
        }).attr("text-anchor", "middle").text(function (d, i) {
                return data[i].label;
            }
        );
        return svgLanguage;
    }

    LanguagePieView.prototype = Object.create(View.prototype);
    LanguagePieView.prototype.constructor = LanguagePieView;


    LanguagePieView.DEFAULT_OPTIONS = {};


    module.exports = LanguagePieView;
});

define(function (require, exports, module) {
    var Surface = require('famous/core/Surface');
    var Modifier = require('famous/core/Modifier');
    var Transform = require('famous/core/Transform');
    var View = require('famous/core/View');
    var Timer = require('famous/utilities/Timer');

    var EventHandler = require('famous/core/EventHandler');
    var NavigationView = require('./NavigationView');

    function MenuView() {
        var that = this;
        View.apply(this, arguments);

        this.eventInput = new EventHandler();
        this.eventOutput = new EventHandler();
        EventHandler.setInputHandler(this, this.eventInput);
        EventHandler.setOutputHandler(this, this.eventOutput);

        this.eventInput.on('pageChange', function (index) {
            that.eventOutput.emit('navigateTo', index);

        })
        _createBacking.call(this);
        _createNavigationViews.call(this);
    }

    MenuView.prototype = Object.create(View.prototype);
    MenuView.prototype.constructor = MenuView;

    MenuView.prototype.resetNavItems = function () {
        for (var i = 0; i < this.navModifiers.length; i++) {
            var initX = -this.options.navWidth / 4;
            var initY = this.options.topOffset + this.options.navItemOffset * i + this.options.navHeight * 2;

            this.navModifiers[i].setOpacity(0.0);
            this.navModifiers[i].setTransform(Transform.translate(initX, initY, 0));
        }
    };

    MenuView.prototype.animateNavItems = function () {
        this.resetNavItems();

        for (var i = 0; i < this.navModifiers.length; i++) {
            // use Timer.setTimeout instead of window.setTimeout
            // Time can be found in famous/utilities

            Timer.setTimeout(function (i) {
                var yOffset = this.options.topOffset + this.options.navItemOffset * i;

                this.navModifiers[i].setOpacity(1, {duration: this.options.duration, curve: 'easeOut'});
                this.navModifiers[i].setTransform(
                    Transform.translate(0, yOffset, 0),
                    {duration: this.options.duration, curve: 'easeOut'});
            }.bind(this, i), i * this.options.staggerDelay);
        }
    };

    MenuView.DEFAULT_OPTIONS = {
        navWidth: 191,
        navHeight: 81,
        topOffset: 10,
        navItemOffset: 90,
        duration: 400,
        staggerDelay: 35
    };

    function _createBacking() {
        var backSurface = new Surface({
            size: [this.options.width, this.options.height],
            properties: {
                backgroundColor: '#595153'
            }
        });

        this._add(backSurface);
    }

    function _createNavigationViews() {
        this.navModifiers = [];

        var navData = [
            {iconUrl: 'img/nav-icons/home.png'},
            {iconUrl: 'img/nav-icons/about-us.png'},
            {iconUrl: 'img/nav-icons/demographics.png'},
            {iconUrl: 'img/nav-icons/clients.png'},
            {iconUrl: 'img/nav-icons/radio.png'},
            {iconUrl: 'img/nav-icons/contact-us.png'},
        ];

        for (var i = 0; i < navData.length; i++) {
            var navView = new NavigationView({
                width: this.options.navWidth,
                height: this.options.navHeight,
                iconUrl: navData[i].iconUrl,
                index: i
            });
            navView.pipe(this);

            var yOffset = this.options.topOffset + this.options.navItemOffset * i;

            var navModifier = new Modifier({
                transform: Transform.translate(0, yOffset, 0)
            });

            this.navModifiers.push(navModifier);
            this._add(navModifier).add(navView);
        }
    }

    module.exports = MenuView;
});

define(function(require, exports, module) {
	var Surface = require('famous/core/Surface');
	var Modifier = require('famous/core/Modifier');
	var Transform = require('famous/core/Transform');
	var EventHandler = require('famous/core/EventHandler');
	var View = require('famous/core/View');

	function NavigationView() {
		View.apply(this, arguments);
		this.eventOutput = new EventHandler();
		EventHandler.setOutputHandler(this, this.eventOutput);

		_createIcon.call(this);
	}

	NavigationView.prototype = Object.create(View.prototype);
	NavigationView.prototype.constructor = NavigationView;

	NavigationView.DEFAULT_OPTIONS = {
		width: 1000,
		height: null,
		iconUrl: null,
		index: null
	};

	function _createIcon() {
		var that = this;
		var iconSurface = new Surface({
			content: '<img width="191" src="' + this.options.iconUrl + '"/>'
		});
		iconSurface.on('click', function() {
			that.eventOutput.emit('pageChange', that.options.index);
		})
		this._add(iconSurface);
	};

	module.exports = NavigationView;
});

define(function (require, exports, module) {

    var d3            = require('d3/d3');
    var Surface = require('famous/core/Surface');
    var Modifier = require('famous/core/Modifier');
    var Transform = require('famous/core/Transform');
    var View = require('famous/core/View');
    var HomeScroll = require('views/HomeScroll');
    var HeaderFooterLayout = require('famous/views/HeaderFooterLayout');
    var GridLayout = require("famous/views/GridLayout");

    var HeaderView = require('views/HeaderView');
    var homePage = require('text!jade/homePage.html');
    var aboutUsPage = require('text!jade/aboutUsPage.html');
    var demographicsPage = require('text!jade/demographicsPage.html');
    var clientsPage = require('text!jade/clientsPage.html');
    var radioPage = require('text!jade/radioPage.html');

    var GenericSync = require("famous/inputs/GenericSync");
    var MouseSync = require("famous/inputs/MouseSync");
    var TouchSync = require("famous/inputs/TouchSync");
    var ScrollSync = require("famous/inputs/ScrollSync");

    var Transform = require('famous/core/Transform');
    var Transitionable = require('famous/transitions/Transitionable');


    function PageView() {
        var that = this;

        GenericSync.register({
            touch: TouchSync,
            scroll: ScrollSync
        });

        var genericSync = new GenericSync(['mouse', 'touch', 'scroll']);

        View.apply(this, arguments);

        this.layout = new HeaderFooterLayout({
            headerSize: 50,
            footerSize: 50
        });

        /*Header*/
        this.header = new HeaderView();
        this.header.pipe(this);

        /*Content*/
        this.content = new HomeScroll(genericSync);
        this.content.pipe(this);

        var currentIndex = 0;
        var part = 1 / 6;
        var prevElement, prevElementTemp,
            currentElement, currentElementTemp, direction;
        genericSync.on("update", function (data) {
            delta = data.delta[1];
            if (delta < 0) {
                direction = -1;
                currentIndex++;
            } else {
                currentIndex--;
                direction = 1;
            }

            if (currentIndex > 5) {
                currentIndex = 5;
            }
            if (currentIndex < 0) {
                currentIndex = 0;
            }

            try {
                prevElementTemp = that.states[currentIndex + direction];
            } catch (e) {
                prevElementTemp = null;
            }
            if (prevElementTemp !== null && prevElementTemp !== prevElement) {
                prevElement = prevElementTemp;
                prevElement.set(0, {duration: 100});
            }

            currentElementTemp = that.states[currentIndex];
            if (currentElementTemp !== currentElement) {
                currentElement = currentElementTemp;
                currentElement.set(1, {duration: 200});

            }

        });

        /* =Footer*/
        this.footers = [];
        this.footer = new GridLayout({
            dimensions: [3, 1]
        });
        this.footer.pipe(this);

        this.footerLeft = new Surface({
            size: [undefined, undefined],
            properties: {
                backgroundSize: 'cover'
            }
        })

        this.footerCenter = new Surface({
            size: [undefined, undefined],
            properties: {
                backgroundSize: 'cover'
            }
        })

        this.footerRight = new Surface({
            size: [undefined, undefined],
            properties: {
                //backgroundColor: '#F27649',
                backgroundSize: 'cover'
            }
        })
        this.footers.push(this.footerLeft);

        this.footers.push(this.footerCenter);
        this.footers.push(this.footerRight);
        this.footer.sequenceFrom(this.footers);

        this.layout.content.add(this.content);
        this.layout.header.add(this.header);

        this.state1 = new Transitionable(1);
        this.modifier1 = new Modifier({
            opacity: function () {
                return that.state1.get();
            }
        });
        this.surface1 = new Surface({
            size: [undefined, undefined],
            properties: {
                backgroundColor: 'purple'
            }
        });

        this.state2 = new Transitionable(0);
        this.modifier2 = new Modifier({
            opacity: function () {
                return that.state2.get();
            }
        });
        this.surface2 = new Surface({
            size: [undefined, undefined],
            properties: {
                backgroundColor: 'green'
            }
        });

        this.state3 = new Transitionable(0);
        this.modifier3 = new Modifier({
            opacity: function () {
                return that.state3.get();
            }
        });
        this.surface3 = new Surface({
            size: [undefined, undefined],
            properties: {
                backgroundColor: 'red'
            }
        });

        this.state4 = new Transitionable(0);
        this.modifier4 = new Modifier({
            opacity: function () {
                return that.state4.get();
            }
        });
        this.surface4 = new Surface({
            size: [undefined, undefined],
            properties: {
                backgroundColor: 'yellow'
            }
        });

        this.state5 = new Transitionable(0);
        this.modifier5 = new Modifier({
            opacity: function () {
                return that.state5.get();
            }
        });
        this.surface5 = new Surface({
            size: [undefined, undefined],
            properties: {
                backgroundColor: 'brown'
            }
        });

        this.state6 = new Transitionable(0);
        this.modifier6 = new Modifier({
            opacity: function () {
                return that.state6.get();
            }
        });
        this.surface6 = new Surface({
            size: [undefined, undefined],
            properties: {
                backgroundColor: 'blue'
            }
        });
        this.states = [];
        this.states.push(this.state1);
        this.states.push(this.state2);
        this.states.push(this.state3);
        this.states.push(this.state4);
        this.states.push(this.state5);
        this.states.push(this.state6);

        this.layout.footer.add(this.modifier1).add(this.surface1).add(this.footer);
        this.layout.footer.add(this.modifier2).add(this.surface2).add(this.footer);
        this.layout.footer.add(this.modifier3).add(this.surface3).add(this.footer);
        this.layout.footer.add(this.modifier4).add(this.surface4).add(this.footer);
        this.layout.footer.add(this.modifier5).add(this.surface5).add(this.footer);
        this.layout.footer.add(this.modifier6).add(this.surface6).add(this.footer);

        this._eventInput.pipe(this._eventOutput);

        this.add(this.layout);
    }

    PageView.prototype = Object.create(View.prototype);
    PageView.prototype.constructor = PageView;

    PageView.prototype.navigateTo = function (index) {
        for (var i = 0; i < this.states.length; i++) {
            var state = this.states[i];
            state.set(0);
        }
        var navigatedState = this.states[index];
        navigatedState.set(1, {duration: 300});
        this.content.scrollview.goToPage(index);
    }

    module.exports = PageView;

})
;


define(function(require, exports, module) {
  var d3            = require('d3/d3');
  var View          = require('famous/core/View');
  var Surface       = require('famous/core/Surface');
  var Transform     = require('famous/core/Transform');
  var StateModifier = require('famous/modifiers/StateModifier');
  var Easing        = require('famous/transitions/Easing');
  var Modifier      = require('famous/core/Modifier');

  var createBarView = function (viewHeight, viewWidth, data) {
    var tooltip = { w: 90, h: 40 };
    var margins = {t: 50, r: 20, b: 30, l: 40};
    var width  = viewWidth  - margins.l - margins.r;
    var height = viewHeight - margins.t - margins.b;

    var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1);

    var y = d3.scale.linear()
        .range([height, 0]);

    x.domain(data.map(function (d) { return d.letter; }));
    y.domain([0, d3.max(data, function (d) { return d.frequency; })]);

    var background = new Surface({
      size: [viewWidth, viewHeight],
      properties: {
        backgroundColor: '#fff',
        border: '1px solid #6E7577',
        borderRadius: '8px'
      }
    });

    var tooltipSurface = new Surface({
      size: [tooltip.w, tooltip.h],
      classes: ['tooltip']
    });

    var tooltipModifier = new StateModifier({
      origin: [0, 0]
    });

    var getBar = function (d) {
      var bar = new Surface({
        size: [x.rangeBand(), height - y(d.frequency)],
        content: height - y(d.frequency) > 12 ? (d.letter):'',
        classes: ['bar'],
        properties: {
          textAlign: 'center',
          color: '#FFFBF7',
          border: '2px solid #A5A9AA',
          backgroundColor: '#36211C'
        }
      });

      bar.on('mouseover', function (e) {
        var newX, newY;

        tooltipSurface.setProperties({display: 'inline'});
        tooltipSurface.setContent("Letter: " + d.letter + "<br/>" + d3.format('.2p')(d.frequency));

        newX = x(d.letter) + margins.l - (tooltip.w / 2) + (x.rangeBand() / 2);
        newY = y(d.frequency) + margins.t - tooltip.h - 15;

        tooltipModifier.setTransform(
          Transform.translate(newX, newY, 2),
          { duration : 50, curve: Easing.outCirc }
        );

        this.setProperties({
          backgroundColor: '#897D7A'
        });
      });

      bar.on('mouseout', function() {
        tooltipSurface.setProperties({display: 'none'});
        this.setProperties({
          backgroundColor: '#36211C'
        });
      });

      return bar;
    };

    var getBarModifier = function (d, i) { 
      var modifier = new StateModifier();
      modifier.setTransform(
        Transform.translate(x(d.letter) + 1000, y(d.frequency) + margins.t, 1),
        { duration : 0 , curve: Easing.inOutElastic }
      );
      modifier.setTransform(
        Transform.translate(x(d.letter) + margins.l, y(d.frequency) + margins.t, 1),
        { duration : i * 100 + 30, curve: Easing.inOutElastic }
      );

      return modifier;
    };

    var view = new View({size: [viewWidth, viewHeight]});
    view.add(background);

    data.forEach(function (item, index) {
      view.add(getBarModifier(item, index)).add(getBar(item));
    });

    view.add(tooltipModifier).add(tooltipSurface);

    return view;
  };
  
  module.exports = createBarView;
});
define(function (require, exports, module) {
    var Surface = require('famous/core/Surface');

    var View = require('famous/core/View');

    function HomePage() {
        _createContent.call(this);
    }

    HomePage.prototype = Object.create(Surface.prototype);
    HomePage.prototype.constructor = HomePage;

    HomePage.DEFAULT_OPTIONS = {};

    function _createContent() {

        var page1 = require('text!jade/page1.html');

        this.contentHome = new Surface({
            size: [undefined, undefined],
            content: page1,
            properties: {
                fontSize: '16px',
                backgroundColor: '#FFFAE2'
            }
        });

    };

    module.exports = HomePage;
});


define(['require', 'famous/core/Engine', 'views/AppView'], function (require, Engine, AppView) {

    var Transform = require('famous/core/Transform');
    var mainContext = Engine.createContext();



    var appView = new AppView();


    mainContext.add(appView);
});
