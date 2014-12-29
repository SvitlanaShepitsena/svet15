define("famous/core/Entity", ["require", "exports", "module"], function (require, exports, module) {
    function get(id) {
        return entities[id]
    }

    function set(id, entity) {
        entities[id] = entity
    }

    function register(entity) {
        var id = entities.length;
        return set(id, entity), id
    }

    function unregister(id) {
        set(id, null)
    }

    var entities = [];
    module.exports = {register: register, unregister: unregister, get: get, set: set}
}), define("famous/core/Transform", ["require", "exports", "module"], function (require, exports, module) {
    function _normSquared(v) {
        return 2 === v.length ? v[0] * v[0] + v[1] * v[1] : v[0] * v[0] + v[1] * v[1] + v[2] * v[2]
    }

    function _norm(v) {
        return Math.sqrt(_normSquared(v))
    }

    function _sign(n) {
        return 0 > n ? -1 : 1
    }

    var Transform = {};
    Transform.precision = 1e-6, Transform.identity = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1], Transform.multiply4x4 = function (a, b) {
        return [a[0] * b[0] + a[4] * b[1] + a[8] * b[2] + a[12] * b[3], a[1] * b[0] + a[5] * b[1] + a[9] * b[2] + a[13] * b[3], a[2] * b[0] + a[6] * b[1] + a[10] * b[2] + a[14] * b[3], a[3] * b[0] + a[7] * b[1] + a[11] * b[2] + a[15] * b[3], a[0] * b[4] + a[4] * b[5] + a[8] * b[6] + a[12] * b[7], a[1] * b[4] + a[5] * b[5] + a[9] * b[6] + a[13] * b[7], a[2] * b[4] + a[6] * b[5] + a[10] * b[6] + a[14] * b[7], a[3] * b[4] + a[7] * b[5] + a[11] * b[6] + a[15] * b[7], a[0] * b[8] + a[4] * b[9] + a[8] * b[10] + a[12] * b[11], a[1] * b[8] + a[5] * b[9] + a[9] * b[10] + a[13] * b[11], a[2] * b[8] + a[6] * b[9] + a[10] * b[10] + a[14] * b[11], a[3] * b[8] + a[7] * b[9] + a[11] * b[10] + a[15] * b[11], a[0] * b[12] + a[4] * b[13] + a[8] * b[14] + a[12] * b[15], a[1] * b[12] + a[5] * b[13] + a[9] * b[14] + a[13] * b[15], a[2] * b[12] + a[6] * b[13] + a[10] * b[14] + a[14] * b[15], a[3] * b[12] + a[7] * b[13] + a[11] * b[14] + a[15] * b[15]]
    }, Transform.multiply = function (a, b) {
        return [a[0] * b[0] + a[4] * b[1] + a[8] * b[2], a[1] * b[0] + a[5] * b[1] + a[9] * b[2], a[2] * b[0] + a[6] * b[1] + a[10] * b[2], 0, a[0] * b[4] + a[4] * b[5] + a[8] * b[6], a[1] * b[4] + a[5] * b[5] + a[9] * b[6], a[2] * b[4] + a[6] * b[5] + a[10] * b[6], 0, a[0] * b[8] + a[4] * b[9] + a[8] * b[10], a[1] * b[8] + a[5] * b[9] + a[9] * b[10], a[2] * b[8] + a[6] * b[9] + a[10] * b[10], 0, a[0] * b[12] + a[4] * b[13] + a[8] * b[14] + a[12], a[1] * b[12] + a[5] * b[13] + a[9] * b[14] + a[13], a[2] * b[12] + a[6] * b[13] + a[10] * b[14] + a[14], 1]
    }, Transform.thenMove = function (m, t) {
        return t[2] || (t[2] = 0), [m[0], m[1], m[2], 0, m[4], m[5], m[6], 0, m[8], m[9], m[10], 0, m[12] + t[0], m[13] + t[1], m[14] + t[2], 1]
    }, Transform.moveThen = function (v, m) {
        v[2] || (v[2] = 0);
        var t0 = v[0] * m[0] + v[1] * m[4] + v[2] * m[8], t1 = v[0] * m[1] + v[1] * m[5] + v[2] * m[9], t2 = v[0] * m[2] + v[1] * m[6] + v[2] * m[10];
        return Transform.thenMove(m, [t0, t1, t2])
    }, Transform.translate = function (x, y, z) {
        return void 0 === z && (z = 0), [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, x, y, z, 1]
    }, Transform.thenScale = function (m, s) {
        return [s[0] * m[0], s[1] * m[1], s[2] * m[2], 0, s[0] * m[4], s[1] * m[5], s[2] * m[6], 0, s[0] * m[8], s[1] * m[9], s[2] * m[10], 0, s[0] * m[12], s[1] * m[13], s[2] * m[14], 1]
    }, Transform.scale = function (x, y, z) {
        return void 0 === z && (z = 1), void 0 === y && (y = x), [x, 0, 0, 0, 0, y, 0, 0, 0, 0, z, 0, 0, 0, 0, 1]
    }, Transform.rotateX = function (theta) {
        var cosTheta = Math.cos(theta), sinTheta = Math.sin(theta);
        return [1, 0, 0, 0, 0, cosTheta, sinTheta, 0, 0, -sinTheta, cosTheta, 0, 0, 0, 0, 1]
    }, Transform.rotateY = function (theta) {
        var cosTheta = Math.cos(theta), sinTheta = Math.sin(theta);
        return [cosTheta, 0, -sinTheta, 0, 0, 1, 0, 0, sinTheta, 0, cosTheta, 0, 0, 0, 0, 1]
    }, Transform.rotateZ = function (theta) {
        var cosTheta = Math.cos(theta), sinTheta = Math.sin(theta);
        return [cosTheta, sinTheta, 0, 0, -sinTheta, cosTheta, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
    }, Transform.rotate = function (phi, theta, psi) {
        var cosPhi = Math.cos(phi), sinPhi = Math.sin(phi), cosTheta = Math.cos(theta), sinTheta = Math.sin(theta), cosPsi = Math.cos(psi), sinPsi = Math.sin(psi), result = [cosTheta * cosPsi, cosPhi * sinPsi + sinPhi * sinTheta * cosPsi, sinPhi * sinPsi - cosPhi * sinTheta * cosPsi, 0, -cosTheta * sinPsi, cosPhi * cosPsi - sinPhi * sinTheta * sinPsi, sinPhi * cosPsi + cosPhi * sinTheta * sinPsi, 0, sinTheta, -sinPhi * cosTheta, cosPhi * cosTheta, 0, 0, 0, 0, 1];
        return result
    }, Transform.rotateAxis = function (v, theta) {
        var sinTheta = Math.sin(theta), cosTheta = Math.cos(theta), verTheta = 1 - cosTheta, xxV = v[0] * v[0] * verTheta, xyV = v[0] * v[1] * verTheta, xzV = v[0] * v[2] * verTheta, yyV = v[1] * v[1] * verTheta, yzV = v[1] * v[2] * verTheta, zzV = v[2] * v[2] * verTheta, xs = v[0] * sinTheta, ys = v[1] * sinTheta, zs = v[2] * sinTheta, result = [xxV + cosTheta, xyV + zs, xzV - ys, 0, xyV - zs, yyV + cosTheta, yzV + xs, 0, xzV + ys, yzV - xs, zzV + cosTheta, 0, 0, 0, 0, 1];
        return result
    }, Transform.aboutOrigin = function (v, m) {
        var t0 = v[0] - (v[0] * m[0] + v[1] * m[4] + v[2] * m[8]), t1 = v[1] - (v[0] * m[1] + v[1] * m[5] + v[2] * m[9]), t2 = v[2] - (v[0] * m[2] + v[1] * m[6] + v[2] * m[10]);
        return Transform.thenMove(m, [t0, t1, t2])
    }, Transform.skew = function (phi, theta, psi) {
        return [1, Math.tan(theta), 0, 0, Math.tan(psi), 1, 0, 0, 0, Math.tan(phi), 1, 0, 0, 0, 0, 1]
    }, Transform.skewX = function (angle) {
        return [1, 0, 0, 0, Math.tan(angle), 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
    }, Transform.skewY = function (angle) {
        return [1, Math.tan(angle), 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
    }, Transform.perspective = function (focusZ) {
        return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, -1 / focusZ, 0, 0, 0, 1]
    }, Transform.getTranslate = function (m) {
        return [m[12], m[13], m[14]]
    }, Transform.inverse = function (m) {
        var c0 = m[5] * m[10] - m[6] * m[9], c1 = m[4] * m[10] - m[6] * m[8], c2 = m[4] * m[9] - m[5] * m[8], c4 = m[1] * m[10] - m[2] * m[9], c5 = m[0] * m[10] - m[2] * m[8], c6 = m[0] * m[9] - m[1] * m[8], c8 = m[1] * m[6] - m[2] * m[5], c9 = m[0] * m[6] - m[2] * m[4], c10 = m[0] * m[5] - m[1] * m[4], detM = m[0] * c0 - m[1] * c1 + m[2] * c2, invD = 1 / detM, result = [invD * c0, -invD * c4, invD * c8, 0, -invD * c1, invD * c5, -invD * c9, 0, invD * c2, -invD * c6, invD * c10, 0, 0, 0, 0, 1];
        return result[12] = -m[12] * result[0] - m[13] * result[4] - m[14] * result[8], result[13] = -m[12] * result[1] - m[13] * result[5] - m[14] * result[9], result[14] = -m[12] * result[2] - m[13] * result[6] - m[14] * result[10], result
    }, Transform.transpose = function (m) {
        return [m[0], m[4], m[8], m[12], m[1], m[5], m[9], m[13], m[2], m[6], m[10], m[14], m[3], m[7], m[11], m[15]]
    }, Transform.interpret = function (M) {
        var x = [M[0], M[1], M[2]], sgn = _sign(x[0]), xNorm = _norm(x), v = [x[0] + sgn * xNorm, x[1], x[2]], mult = 2 / _normSquared(v);
        if (mult >= 1 / 0)return {
            translate: Transform.getTranslate(M),
            rotate: [0, 0, 0],
            scale: [0, 0, 0],
            skew: [0, 0, 0]
        };
        var Q1 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1];
        Q1[0] = 1 - mult * v[0] * v[0], Q1[5] = 1 - mult * v[1] * v[1], Q1[10] = 1 - mult * v[2] * v[2], Q1[1] = -mult * v[0] * v[1], Q1[2] = -mult * v[0] * v[2], Q1[6] = -mult * v[1] * v[2], Q1[4] = Q1[1], Q1[8] = Q1[2], Q1[9] = Q1[6];
        var MQ1 = Transform.multiply(Q1, M), x2 = [MQ1[5], MQ1[6]], sgn2 = _sign(x2[0]), x2Norm = _norm(x2), v2 = [x2[0] + sgn2 * x2Norm, x2[1]], mult2 = 2 / _normSquared(v2), Q2 = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1];
        Q2[5] = 1 - mult2 * v2[0] * v2[0], Q2[10] = 1 - mult2 * v2[1] * v2[1], Q2[6] = -mult2 * v2[0] * v2[1], Q2[9] = Q2[6];
        var Q = Transform.multiply(Q2, Q1), R = Transform.multiply(Q, M), remover = Transform.scale(R[0] < 0 ? -1 : 1, R[5] < 0 ? -1 : 1, R[10] < 0 ? -1 : 1);
        R = Transform.multiply(R, remover), Q = Transform.multiply(remover, Q);
        var result = {};
        return result.translate = Transform.getTranslate(M), result.rotate = [Math.atan2(-Q[6], Q[10]), Math.asin(Q[2]), Math.atan2(-Q[1], Q[0])], result.rotate[0] || (result.rotate[0] = 0, result.rotate[2] = Math.atan2(Q[4], Q[5])), result.scale = [R[0], R[5], R[10]], result.skew = [Math.atan2(R[9], result.scale[2]), Math.atan2(R[8], result.scale[2]), Math.atan2(R[4], result.scale[0])], Math.abs(result.rotate[0]) + Math.abs(result.rotate[2]) > 1.5 * Math.PI && (result.rotate[1] = Math.PI - result.rotate[1], result.rotate[1] > Math.PI && (result.rotate[1] -= 2 * Math.PI), result.rotate[1] < -Math.PI && (result.rotate[1] += 2 * Math.PI), result.rotate[0] < 0 ? result.rotate[0] += Math.PI : result.rotate[0] -= Math.PI, result.rotate[2] < 0 ? result.rotate[2] += Math.PI : result.rotate[2] -= Math.PI), result
    }, Transform.average = function (M1, M2, t) {
        t = void 0 === t ? .5 : t;
        for (var specM1 = Transform.interpret(M1), specM2 = Transform.interpret(M2), specAvg = {
            translate: [0, 0, 0],
            rotate: [0, 0, 0],
            scale: [0, 0, 0],
            skew: [0, 0, 0]
        }, i = 0; 3 > i; i++)specAvg.translate[i] = (1 - t) * specM1.translate[i] + t * specM2.translate[i], specAvg.rotate[i] = (1 - t) * specM1.rotate[i] + t * specM2.rotate[i], specAvg.scale[i] = (1 - t) * specM1.scale[i] + t * specM2.scale[i], specAvg.skew[i] = (1 - t) * specM1.skew[i] + t * specM2.skew[i];
        return Transform.build(specAvg)
    }, Transform.build = function (spec) {
        var scaleMatrix = Transform.scale(spec.scale[0], spec.scale[1], spec.scale[2]), skewMatrix = Transform.skew(spec.skew[0], spec.skew[1], spec.skew[2]), rotateMatrix = Transform.rotate(spec.rotate[0], spec.rotate[1], spec.rotate[2]);
        return Transform.thenMove(Transform.multiply(Transform.multiply(rotateMatrix, skewMatrix), scaleMatrix), spec.translate)
    }, Transform.equals = function (a, b) {
        return !Transform.notEquals(a, b)
    }, Transform.notEquals = function (a, b) {
        return a === b ? !1 : !(a && b) || a[12] !== b[12] || a[13] !== b[13] || a[14] !== b[14] || a[0] !== b[0] || a[1] !== b[1] || a[2] !== b[2] || a[4] !== b[4] || a[5] !== b[5] || a[6] !== b[6] || a[8] !== b[8] || a[9] !== b[9] || a[10] !== b[10]
    }, Transform.normalizeRotation = function (rotation) {
        var result = rotation.slice(0);
        for ((result[0] === .5 * Math.PI || result[0] === .5 * -Math.PI) && (result[0] = -result[0], result[1] = Math.PI - result[1], result[2] -= Math.PI), result[0] > .5 * Math.PI && (result[0] = result[0] - Math.PI, result[1] = Math.PI - result[1], result[2] -= Math.PI), result[0] < .5 * -Math.PI && (result[0] = result[0] + Math.PI, result[1] = -Math.PI - result[1], result[2] -= Math.PI); result[1] < -Math.PI;)result[1] += 2 * Math.PI;
        for (; result[1] >= Math.PI;)result[1] -= 2 * Math.PI;
        for (; result[2] < -Math.PI;)result[2] += 2 * Math.PI;
        for (; result[2] >= Math.PI;)result[2] -= 2 * Math.PI;
        return result
    }, Transform.inFront = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, .001, 1], Transform.behind = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, -.001, 1], module.exports = Transform
}), define("famous/core/SpecParser", ["require", "exports", "module", "./Transform"], function (require, exports, module) {
    function SpecParser() {
        this.result = {}
    }

    function _vecInContext(v, m) {
        return [v[0] * m[0] + v[1] * m[4] + v[2] * m[8], v[0] * m[1] + v[1] * m[5] + v[2] * m[9], v[0] * m[2] + v[1] * m[6] + v[2] * m[10]]
    }

    var Transform = require("./Transform");
    SpecParser._instance = new SpecParser, SpecParser.parse = function (spec, context) {
        return SpecParser._instance.parse(spec, context)
    }, SpecParser.prototype.parse = function (spec, context) {
        return this.reset(), this._parseSpec(spec, context, Transform.identity), this.result
    }, SpecParser.prototype.reset = function () {
        this.result = {}
    };
    var _zeroZero = [0, 0];
    SpecParser.prototype._parseSpec = function (spec, parentContext, sizeContext) {
        var id, target, transform, opacity, origin, align, size;
        if ("number" == typeof spec) {
            if (id = spec, transform = parentContext.transform, align = parentContext.align || _zeroZero, parentContext.size && align && (align[0] || align[1])) {
                var alignAdjust = [align[0] * parentContext.size[0], align[1] * parentContext.size[1], 0];
                transform = Transform.thenMove(transform, _vecInContext(alignAdjust, sizeContext))
            }
            this.result[id] = {
                transform: transform,
                opacity: parentContext.opacity,
                origin: parentContext.origin || _zeroZero,
                align: parentContext.align || _zeroZero,
                size: parentContext.size
            }
        } else {
            if (!spec)return;
            if (spec instanceof Array)for (var i = 0; i < spec.length; i++)this._parseSpec(spec[i], parentContext, sizeContext); else {
                target = spec.target, transform = parentContext.transform, opacity = parentContext.opacity, origin = parentContext.origin, align = parentContext.align, size = parentContext.size;
                var nextSizeContext = sizeContext;
                if (void 0 !== spec.opacity && (opacity = parentContext.opacity * spec.opacity), spec.transform && (transform = Transform.multiply(parentContext.transform, spec.transform)), spec.origin && (origin = spec.origin, nextSizeContext = parentContext.transform), spec.align && (align = spec.align), spec.size || spec.proportions) {
                    var parentSize = size;
                    size = [size[0], size[1]], spec.size && (void 0 !== spec.size[0] && (size[0] = spec.size[0]), void 0 !== spec.size[1] && (size[1] = spec.size[1])), spec.proportions && (void 0 !== spec.proportions[0] && (size[0] = size[0] * spec.proportions[0]), void 0 !== spec.proportions[1] && (size[1] = size[1] * spec.proportions[1])), parentSize && (align && (align[0] || align[1]) && (transform = Transform.thenMove(transform, _vecInContext([align[0] * parentSize[0], align[1] * parentSize[1], 0], sizeContext))), origin && (origin[0] || origin[1]) && (transform = Transform.moveThen([-origin[0] * size[0], -origin[1] * size[1], 0], transform))), nextSizeContext = parentContext.transform, origin = null, align = null
                }
                this._parseSpec(target, {
                    transform: transform,
                    opacity: opacity,
                    origin: origin,
                    align: align,
                    size: size
                }, nextSizeContext)
            }
        }
    }, module.exports = SpecParser
}), define("famous/core/RenderNode", ["require", "exports", "module", "./Entity", "./SpecParser"], function (require, exports, module) {
    function RenderNode(object) {
        this._object = null, this._child = null, this._hasMultipleChildren = !1, this._isRenderable = !1, this._isModifier = !1, this._resultCache = {}, this._prevResults = {}, this._childResult = null, object && this.set(object)
    }

    function _applyCommit(spec, context, cacheStorage) {
        for (var result = SpecParser.parse(spec, context), keys = Object.keys(result), i = 0; i < keys.length; i++) {
            var id = keys[i], childNode = Entity.get(id), commitParams = result[id];
            commitParams.allocator = context.allocator;
            var commitResult = childNode.commit(commitParams);
            commitResult ? _applyCommit(commitResult, context, cacheStorage) : cacheStorage[id] = commitParams
        }
    }

    var Entity = require("./Entity"), SpecParser = require("./SpecParser");
    RenderNode.prototype.add = function (child) {
        var childNode = child instanceof RenderNode ? child : new RenderNode(child);
        return this._child instanceof Array ? this._child.push(childNode) : this._child ? (this._child = [this._child, childNode], this._hasMultipleChildren = !0, this._childResult = []) : this._child = childNode, childNode
    }, RenderNode.prototype.get = function () {
        return this._object || (this._hasMultipleChildren ? null : this._child ? this._child.get() : null)
    }, RenderNode.prototype.set = function (child) {
        return this._childResult = null, this._hasMultipleChildren = !1, this._isRenderable = child.render ? !0 : !1, this._isModifier = child.modify ? !0 : !1, this._object = child, this._child = null, child instanceof RenderNode ? child : this
    }, RenderNode.prototype.getSize = function () {
        var result = null, target = this.get();
        return target && target.getSize && (result = target.getSize()), !result && this._child && this._child.getSize && (result = this._child.getSize()), result
    }, RenderNode.prototype.commit = function (context) {
        for (var prevKeys = Object.keys(this._prevResults), i = 0; i < prevKeys.length; i++) {
            var id = prevKeys[i];
            if (void 0 === this._resultCache[id]) {
                var object = Entity.get(id);
                object.cleanup && object.cleanup(context.allocator)
            }
        }
        this._prevResults = this._resultCache, this._resultCache = {}, _applyCommit(this.render(), context, this._resultCache)
    }, RenderNode.prototype.render = function () {
        if (this._isRenderable)return this._object.render();
        var result = null;
        if (this._hasMultipleChildren) {
            result = this._childResult;
            for (var children = this._child, i = 0; i < children.length; i++)result[i] = children[i].render()
        } else this._child && (result = this._child.render());
        return this._isModifier ? this._object.modify(result) : result
    }, module.exports = RenderNode
}), define("famous/core/EventEmitter", ["require", "exports", "module"], function (require, exports, module) {
    function EventEmitter() {
        this.listeners = {}, this._owner = this
    }

    EventEmitter.prototype.emit = function (type, event) {
        var handlers = this.listeners[type];
        if (handlers)for (var i = 0; i < handlers.length; i++)handlers[i].call(this._owner, event);
        return this
    }, EventEmitter.prototype.on = function (type, handler) {
        type in this.listeners || (this.listeners[type] = []);
        var index = this.listeners[type].indexOf(handler);
        return 0 > index && this.listeners[type].push(handler), this
    }, EventEmitter.prototype.addListener = EventEmitter.prototype.on, EventEmitter.prototype.removeListener = function (type, handler) {
        var listener = this.listeners[type];
        if (void 0 !== listener) {
            var index = listener.indexOf(handler);
            index >= 0 && listener.splice(index, 1)
        }
        return this
    }, EventEmitter.prototype.bindThis = function (owner) {
        this._owner = owner
    }, module.exports = EventEmitter
}), define("famous/core/EventHandler", ["require", "exports", "module", "./EventEmitter"], function (require, exports, module) {
    function EventHandler() {
        EventEmitter.apply(this, arguments), this.downstream = [], this.downstreamFn = [], this.upstream = [], this.upstreamListeners = {}
    }

    var EventEmitter = require("./EventEmitter");
    EventHandler.prototype = Object.create(EventEmitter.prototype), EventHandler.prototype.constructor = EventHandler, EventHandler.setInputHandler = function (object, handler) {
        object.trigger = handler.trigger.bind(handler), handler.subscribe && handler.unsubscribe && (object.subscribe = handler.subscribe.bind(handler), object.unsubscribe = handler.unsubscribe.bind(handler))
    }, EventHandler.setOutputHandler = function (object, handler) {
        handler instanceof EventHandler && handler.bindThis(object), object.pipe = handler.pipe.bind(handler), object.unpipe = handler.unpipe.bind(handler), object.on = handler.on.bind(handler), object.addListener = object.on, object.removeListener = handler.removeListener.bind(handler)
    }, EventHandler.prototype.emit = function (type, event) {
        EventEmitter.prototype.emit.apply(this, arguments);
        var i = 0;
        for (i = 0; i < this.downstream.length; i++)this.downstream[i].trigger && this.downstream[i].trigger(type, event);
        for (i = 0; i < this.downstreamFn.length; i++)this.downstreamFn[i](type, event);
        return this
    }, EventHandler.prototype.trigger = EventHandler.prototype.emit, EventHandler.prototype.pipe = function (target) {
        if (target.subscribe instanceof Function)return target.subscribe(this);
        var downstreamCtx = target instanceof Function ? this.downstreamFn : this.downstream, index = downstreamCtx.indexOf(target);
        return 0 > index && downstreamCtx.push(target), target instanceof Function ? target("pipe", null) : target.trigger && target.trigger("pipe", null), target
    }, EventHandler.prototype.unpipe = function (target) {
        if (target.unsubscribe instanceof Function)return target.unsubscribe(this);
        var downstreamCtx = target instanceof Function ? this.downstreamFn : this.downstream, index = downstreamCtx.indexOf(target);
        return index >= 0 ? (downstreamCtx.splice(index, 1), target instanceof Function ? target("unpipe", null) : target.trigger && target.trigger("unpipe", null), target) : !1
    }, EventHandler.prototype.on = function (type) {
        if (EventEmitter.prototype.on.apply(this, arguments), !(type in this.upstreamListeners)) {
            var upstreamListener = this.trigger.bind(this, type);
            this.upstreamListeners[type] = upstreamListener;
            for (var i = 0; i < this.upstream.length; i++)this.upstream[i].on(type, upstreamListener)
        }
        return this
    }, EventHandler.prototype.addListener = EventHandler.prototype.on, EventHandler.prototype.subscribe = function (source) {
        var index = this.upstream.indexOf(source);
        if (0 > index) {
            this.upstream.push(source);
            for (var type in this.upstreamListeners)source.on(type, this.upstreamListeners[type])
        }
        return this
    }, EventHandler.prototype.unsubscribe = function (source) {
        var index = this.upstream.indexOf(source);
        if (index >= 0) {
            this.upstream.splice(index, 1);
            for (var type in this.upstreamListeners)source.removeListener(type, this.upstreamListeners[type])
        }
        return this
    }, module.exports = EventHandler
}), define("famous/core/ElementAllocator", ["require", "exports", "module"], function (require, exports, module) {
    function ElementAllocator(container) {
        container || (container = document.createDocumentFragment()), this.container = container, this.detachedNodes = {}, this.nodeCount = 0
    }

    ElementAllocator.prototype.migrate = function (container) {
        var oldContainer = this.container;
        if (container !== oldContainer) {
            if (oldContainer instanceof DocumentFragment)container.appendChild(oldContainer); else for (; oldContainer.hasChildNodes();)container.appendChild(oldContainer.firstChild);
            this.container = container
        }
    }, ElementAllocator.prototype.allocate = function (type) {
        type = type.toLowerCase(), type in this.detachedNodes || (this.detachedNodes[type] = []);
        var result, nodeStore = this.detachedNodes[type];
        return nodeStore.length > 0 ? result = nodeStore.pop() : (result = document.createElement(type), this.container.appendChild(result)), this.nodeCount++, result
    }, ElementAllocator.prototype.deallocate = function (element) {
        var nodeType = element.nodeName.toLowerCase(), nodeStore = this.detachedNodes[nodeType];
        nodeStore.push(element), this.nodeCount--
    }, ElementAllocator.prototype.getNodeCount = function () {
        return this.nodeCount
    }, module.exports = ElementAllocator
}), define("famous/utilities/Utility", ["require", "exports", "module"], function (require, exports, module) {
    var Utility = {};
    Utility.Direction = {X: 0, Y: 1, Z: 2}, Utility.after = function (count, callback) {
        var counter = count;
        return function () {
            counter--, 0 === counter && callback.apply(this, arguments)
        }
    }, Utility.loadURL = function (url, callback) {
        var xhr = new XMLHttpRequest;
        xhr.onreadystatechange = function () {
            4 === this.readyState && callback && callback(this.responseText)
        }, xhr.open("GET", url), xhr.send()
    }, Utility.createDocumentFragmentFromHTML = function (html) {
        var element = document.createElement("div");
        element.innerHTML = html;
        for (var result = document.createDocumentFragment(); element.hasChildNodes();)result.appendChild(element.firstChild);
        return result
    }, Utility.clone = function (b) {
        var a;
        if ("object" == typeof b) {
            a = b instanceof Array ? [] : {};
            for (var key in b)if ("object" == typeof b[key] && null !== b[key])if (b[key]instanceof Array) {
                a[key] = new Array(b[key].length);
                for (var i = 0; i < b[key].length; i++)a[key][i] = Utility.clone(b[key][i])
            } else a[key] = Utility.clone(b[key]); else a[key] = b[key]
        } else a = b;
        return a
    }, module.exports = Utility
}), define("famous/transitions/MultipleTransition", ["require", "exports", "module", "../utilities/Utility"], function (require, exports, module) {
    function MultipleTransition(method) {
        this.method = method, this._instances = [], this.state = []
    }

    var Utility = require("../utilities/Utility");
    MultipleTransition.SUPPORTS_MULTIPLE = !0, MultipleTransition.prototype.get = function () {
        for (var i = 0; i < this._instances.length; i++)this.state[i] = this._instances[i].get();
        return this.state
    }, MultipleTransition.prototype.set = function (endState, transition, callback) {
        for (var _allCallback = Utility.after(endState.length, callback), i = 0; i < endState.length; i++)this._instances[i] || (this._instances[i] = new this.method), this._instances[i].set(endState[i], transition, _allCallback)
    }, MultipleTransition.prototype.reset = function (startState) {
        for (var i = 0; i < startState.length; i++)this._instances[i] || (this._instances[i] = new this.method), this._instances[i].reset(startState[i])
    }, module.exports = MultipleTransition
}), define("famous/transitions/TweenTransition", ["require", "exports", "module"], function (require, exports, module) {
    function TweenTransition(options) {
        this.options = Object.create(TweenTransition.DEFAULT_OPTIONS), options && this.setOptions(options), this._startTime = 0, this._startValue = 0, this._updateTime = 0, this._endValue = 0, this._curve = void 0, this._duration = 0, this._active = !1, this._callback = void 0, this.state = 0, this.velocity = void 0
    }

    function _interpolate(a, b, t) {
        return (1 - t) * a + t * b
    }

    function _clone(obj) {
        return obj instanceof Object ? obj instanceof Array ? obj.slice(0) : Object.create(obj) : obj
    }

    function _normalize(transition, defaultTransition) {
        var result = {curve: defaultTransition.curve};
        return defaultTransition.duration && (result.duration = defaultTransition.duration), defaultTransition.speed && (result.speed = defaultTransition.speed), transition instanceof Object && (void 0 !== transition.duration && (result.duration = transition.duration), transition.curve && (result.curve = transition.curve), transition.speed && (result.speed = transition.speed)), "string" == typeof result.curve && (result.curve = TweenTransition.getCurve(result.curve)), result
    }

    function _calculateVelocity(current, start, curve, duration, t) {
        var velocity, eps = 1e-7, speed = (curve(t) - curve(t - eps)) / eps;
        if (current instanceof Array) {
            velocity = [];
            for (var i = 0; i < current.length; i++)velocity[i] = "number" == typeof current[i] ? speed * (current[i] - start[i]) / duration : 0
        } else velocity = speed * (current - start) / duration;
        return velocity
    }

    function _calculateState(start, end, t) {
        var state;
        if (start instanceof Array) {
            state = [];
            for (var i = 0; i < start.length; i++)state[i] = "number" == typeof start[i] ? _interpolate(start[i], end[i], t) : start[i]
        } else state = _interpolate(start, end, t);
        return state
    }

    TweenTransition.Curves = {
        linear: function (t) {
            return t
        }, easeIn: function (t) {
            return t * t
        }, easeOut: function (t) {
            return t * (2 - t)
        }, easeInOut: function (t) {
            return .5 >= t ? 2 * t * t : -2 * t * t + 4 * t - 1
        }, easeOutBounce: function (t) {
            return t * (3 - 2 * t)
        }, spring: function (t) {
            return (1 - t) * Math.sin(6 * Math.PI * t) + t
        }
    }, TweenTransition.SUPPORTS_MULTIPLE = !0, TweenTransition.DEFAULT_OPTIONS = {
        curve: TweenTransition.Curves.linear,
        duration: 500,
        speed: 0
    };
    var registeredCurves = {};
    TweenTransition.registerCurve = function (curveName, curve) {
        return registeredCurves[curveName] ? !1 : (registeredCurves[curveName] = curve, !0)
    }, TweenTransition.unregisterCurve = function (curveName) {
        return registeredCurves[curveName] ? (delete registeredCurves[curveName], !0) : !1
    }, TweenTransition.getCurve = function (curveName) {
        var curve = registeredCurves[curveName];
        if (void 0 !== curve)return curve;
        throw new Error("curve not registered")
    }, TweenTransition.getCurves = function () {
        return registeredCurves
    }, TweenTransition.prototype.setOptions = function (options) {
        void 0 !== options.curve && (this.options.curve = options.curve), void 0 !== options.duration && (this.options.duration = options.duration), void 0 !== options.speed && (this.options.speed = options.speed)
    }, TweenTransition.prototype.set = function (endValue, transition, callback) {
        if (!transition)return this.reset(endValue), void(callback && callback());
        if (this._startValue = _clone(this.get()), transition = _normalize(transition, this.options), transition.speed) {
            var startValue = this._startValue;
            if (startValue instanceof Object) {
                var variance = 0;
                for (var i in startValue)variance += (endValue[i] - startValue[i]) * (endValue[i] - startValue[i]);
                transition.duration = Math.sqrt(variance) / transition.speed
            } else transition.duration = Math.abs(endValue - startValue) / transition.speed
        }
        this._startTime = Date.now(), this._endValue = _clone(endValue), this._startVelocity = _clone(transition.velocity), this._duration = transition.duration, this._curve = transition.curve, this._active = !0, this._callback = callback
    }, TweenTransition.prototype.reset = function (startValue, startVelocity) {
        if (this._callback) {
            var callback = this._callback;
            this._callback = void 0, callback()
        }
        this.state = _clone(startValue), this.velocity = _clone(startVelocity), this._startTime = 0, this._duration = 0, this._updateTime = 0, this._startValue = this.state, this._startVelocity = this.velocity, this._endValue = this.state, this._active = !1
    }, TweenTransition.prototype.getVelocity = function () {
        return this.velocity
    }, TweenTransition.prototype.get = function (timestamp) {
        return this.update(timestamp), this.state
    }, TweenTransition.prototype.update = function (timestamp) {
        if (this._active) {
            if (timestamp || (timestamp = Date.now()), !(this._updateTime >= timestamp)) {
                this._updateTime = timestamp;
                var timeSinceStart = timestamp - this._startTime;
                if (timeSinceStart >= this._duration)this.state = this._endValue, this.velocity = _calculateVelocity(this.state, this._startValue, this._curve, this._duration, 1), this._active = !1; else if (0 > timeSinceStart)this.state = this._startValue, this.velocity = this._startVelocity; else {
                    var t = timeSinceStart / this._duration;
                    this.state = _calculateState(this._startValue, this._endValue, this._curve(t)), this.velocity = _calculateVelocity(this.state, this._startValue, this._curve, this._duration, t)
                }
            }
        } else if (this._callback) {
            var callback = this._callback;
            this._callback = void 0, callback()
        }
    }, TweenTransition.prototype.isActive = function () {
        return this._active
    }, TweenTransition.prototype.halt = function () {
        this.reset(this.get())
    }, TweenTransition.registerCurve("linear", TweenTransition.Curves.linear), TweenTransition.registerCurve("easeIn", TweenTransition.Curves.easeIn), TweenTransition.registerCurve("easeOut", TweenTransition.Curves.easeOut), TweenTransition.registerCurve("easeInOut", TweenTransition.Curves.easeInOut), TweenTransition.registerCurve("easeOutBounce", TweenTransition.Curves.easeOutBounce), TweenTransition.registerCurve("spring", TweenTransition.Curves.spring), TweenTransition.customCurve = function (v1, v2) {
        return v1 = v1 || 0, v2 = v2 || 0, function (t) {
            return v1 * t + (-2 * v1 - v2 + 3) * t * t + (v1 + v2 - 2) * t * t * t
        }
    }, module.exports = TweenTransition
}), define("famous/transitions/Transitionable", ["require", "exports", "module", "./MultipleTransition", "./TweenTransition"], function (require, exports, module) {
    function Transitionable(start) {
        this.currentAction = null, this.actionQueue = [], this.callbackQueue = [], this.state = 0, this.velocity = void 0, this._callback = void 0, this._engineInstance = null, this._currentMethod = null, this.set(start)
    }

    function _loadNext() {
        if (this._callback) {
            var callback = this._callback;
            this._callback = void 0, callback()
        }
        if (this.actionQueue.length <= 0)return void this.set(this.get());
        this.currentAction = this.actionQueue.shift(), this._callback = this.callbackQueue.shift();
        var method = null, endValue = this.currentAction[0], transition = this.currentAction[1];
        transition instanceof Object && transition.method ? (method = transition.method, "string" == typeof method && (method = transitionMethods[method])) : method = TweenTransition, this._currentMethod !== method && (this._engineInstance = !(endValue instanceof Object) || method.SUPPORTS_MULTIPLE === !0 || endValue.length <= method.SUPPORTS_MULTIPLE ? new method : new MultipleTransition(method), this._currentMethod = method), this._engineInstance.reset(this.state, this.velocity), void 0 !== this.velocity && (transition.velocity = this.velocity), this._engineInstance.set(endValue, transition, _loadNext.bind(this))
    }

    var MultipleTransition = require("./MultipleTransition"), TweenTransition = require("./TweenTransition"), transitionMethods = {};
    Transitionable.register = function (methods) {
        var success = !0;
        for (var method in methods)Transitionable.registerMethod(method, methods[method]) || (success = !1);
        return success
    }, Transitionable.registerMethod = function (name, engineClass) {
        return name in transitionMethods ? !1 : (transitionMethods[name] = engineClass, !0)
    }, Transitionable.unregisterMethod = function (name) {
        return name in transitionMethods ? (delete transitionMethods[name], !0) : !1
    }, Transitionable.prototype.set = function (endState, transition, callback) {
        if (!transition)return this.reset(endState), callback && callback(), this;
        var action = [endState, transition];
        return this.actionQueue.push(action), this.callbackQueue.push(callback), this.currentAction || _loadNext.call(this), this
    }, Transitionable.prototype.reset = function (startState, startVelocity) {
        this._currentMethod = null, this._engineInstance = null, this._callback = void 0, this.state = startState, this.velocity = startVelocity, this.currentAction = null, this.actionQueue = [], this.callbackQueue = []
    }, Transitionable.prototype.delay = function (duration, callback) {
        this.set(this.get(), {
            duration: duration, curve: function () {
                return 0
            }
        }, callback)
    }, Transitionable.prototype.get = function (timestamp) {
        return this._engineInstance && (this._engineInstance.getVelocity && (this.velocity = this._engineInstance.getVelocity()), this.state = this._engineInstance.get(timestamp)), this.state
    }, Transitionable.prototype.isActive = function () {
        return !!this.currentAction
    }, Transitionable.prototype.halt = function () {
        return this.set(this.get())
    }, module.exports = Transitionable
}), define("famous/core/Context", ["require", "exports", "module", "./RenderNode", "./EventHandler", "./ElementAllocator", "./Transform", "../transitions/Transitionable"], function (require, exports, module) {
    function _getElementSize(element) {
        return [element.clientWidth, element.clientHeight]
    }

    function Context(container) {
        this.container = container, this._allocator = new ElementAllocator(container), this._node = new RenderNode, this._eventOutput = new EventHandler, this._size = _getElementSize(this.container), this._perspectiveState = new Transitionable(0), this._perspective = void 0, this._nodeContext = {
            allocator: this._allocator,
            transform: Transform.identity,
            opacity: 1,
            origin: _zeroZero,
            align: _zeroZero,
            size: this._size
        }, this._eventOutput.on("resize", function () {
            this.setSize(_getElementSize(this.container))
        }.bind(this))
    }

    var RenderNode = require("./RenderNode"), EventHandler = require("./EventHandler"), ElementAllocator = require("./ElementAllocator"), Transform = require("./Transform"), Transitionable = require("../transitions/Transitionable"), _zeroZero = [0, 0], usePrefix = !("perspective"in document.documentElement.style), _setPerspective = usePrefix ? function (element, perspective) {
        element.style.webkitPerspective = perspective ? perspective.toFixed() + "px" : ""
    } : function (element, perspective) {
        element.style.perspective = perspective ? perspective.toFixed() + "px" : ""
    };
    Context.prototype.getAllocator = function () {
        return this._allocator
    }, Context.prototype.add = function (obj) {
        return this._node.add(obj)
    }, Context.prototype.migrate = function (container) {
        container !== this.container && (this.container = container, this._allocator.migrate(container))
    }, Context.prototype.getSize = function () {
        return this._size
    }, Context.prototype.setSize = function (size) {
        size || (size = _getElementSize(this.container)), this._size[0] = size[0], this._size[1] = size[1]
    }, Context.prototype.update = function (contextParameters) {
        contextParameters && (contextParameters.transform && (this._nodeContext.transform = contextParameters.transform), contextParameters.opacity && (this._nodeContext.opacity = contextParameters.opacity), contextParameters.origin && (this._nodeContext.origin = contextParameters.origin), contextParameters.align && (this._nodeContext.align = contextParameters.align), contextParameters.size && (this._nodeContext.size = contextParameters.size));
        var perspective = this._perspectiveState.get();
        perspective !== this._perspective && (_setPerspective(this.container, perspective), this._perspective = perspective), this._node.commit(this._nodeContext)
    }, Context.prototype.getPerspective = function () {
        return this._perspectiveState.get()
    }, Context.prototype.setPerspective = function (perspective, transition, callback) {
        return this._perspectiveState.set(perspective, transition, callback)
    }, Context.prototype.emit = function (type, event) {
        return this._eventOutput.emit(type, event)
    }, Context.prototype.on = function (type, handler) {
        return this._eventOutput.on(type, handler)
    }, Context.prototype.removeListener = function (type, handler) {
        return this._eventOutput.removeListener(type, handler)
    }, Context.prototype.pipe = function (target) {
        return this._eventOutput.pipe(target)
    }, Context.prototype.unpipe = function (target) {
        return this._eventOutput.unpipe(target)
    }, module.exports = Context
}), define("famous/core/OptionsManager", ["require", "exports", "module", "./EventHandler"], function (require, exports, module) {
    function OptionsManager(value) {
        this._value = value, this.eventOutput = null
    }

    function _createEventOutput() {
        this.eventOutput = new EventHandler, this.eventOutput.bindThis(this), EventHandler.setOutputHandler(this, this.eventOutput)
    }

    var EventHandler = require("./EventHandler");
    OptionsManager.patch = function (source) {
        for (var manager = new OptionsManager(source), i = 1; i < arguments.length; i++)manager.patch(arguments[i]);
        return source
    }, OptionsManager.prototype.patch = function () {
        for (var myState = this._value, i = 0; i < arguments.length; i++) {
            var data = arguments[i];
            for (var k in data)k in myState && data[k] && data[k].constructor === Object && myState[k] && myState[k].constructor === Object ? (myState.hasOwnProperty(k) || (myState[k] = Object.create(myState[k])), this.key(k).patch(data[k]), this.eventOutput && this.eventOutput.emit("change", {
                id: k,
                value: this.key(k).value()
            })) : this.set(k, data[k])
        }
        return this
    }, OptionsManager.prototype.setOptions = OptionsManager.prototype.patch, OptionsManager.prototype.key = function (identifier) {
        var result = new OptionsManager(this._value[identifier]);
        return (!(result._value instanceof Object) || result._value instanceof Array) && (result._value = {}), result
    }, OptionsManager.prototype.get = function (key) {
        return key ? this._value[key] : this._value
    }, OptionsManager.prototype.getOptions = OptionsManager.prototype.get, OptionsManager.prototype.set = function (key, value) {
        var originalValue = this.get(key);
        return this._value[key] = value, this.eventOutput && value !== originalValue && this.eventOutput.emit("change", {
            id: key,
            value: value
        }), this
    }, OptionsManager.prototype.on = function () {
        return _createEventOutput.call(this), this.on.apply(this, arguments)
    }, OptionsManager.prototype.removeListener = function () {
        return _createEventOutput.call(this), this.removeListener.apply(this, arguments)
    }, OptionsManager.prototype.pipe = function () {
        return _createEventOutput.call(this), this.pipe.apply(this, arguments)
    }, OptionsManager.prototype.unpipe = function () {
        return _createEventOutput.call(this), this.unpipe.apply(this, arguments)
    }, module.exports = OptionsManager
}), define("famous/core/Engine", ["require", "exports", "module", "./Context", "./EventHandler", "./OptionsManager"], function (require, exports, module) {
    function loop() {
        options.runLoop ? (Engine.step(), window.requestAnimationFrame(loop)) : loopEnabled = !1
    }

    function handleResize() {
        for (var i = 0; i < contexts.length; i++)contexts[i].emit("resize");
        eventHandler.emit("resize")
    }

    function initialize() {
        window.addEventListener("touchmove", function (event) {
            event.preventDefault()
        }, !0), addRootClasses()
    }

    function addRootClasses() {
        return document.body ? (document.body.classList.add("famous-root"), void document.documentElement.classList.add("famous-root")) : void Engine.nextTick(addRootClasses)
    }

    function addEngineListener(type, forwarder) {
        return document.body ? void document.body.addEventListener(type, forwarder) : void Engine.nextTick(addEventListener.bind(this, type, forwarder))
    }

    function mount(context, el) {
        return document.body ? (document.body.appendChild(el), void context.emit("resize")) : void Engine.nextTick(mount.bind(this, context, el))
    }

    var frameTime, frameTimeLimit, Context = require("./Context"), EventHandler = require("./EventHandler"), OptionsManager = require("./OptionsManager"), Engine = {}, contexts = [], nextTickQueue = [], currentFrame = 0, nextTickFrame = 0, deferQueue = [], lastTime = Date.now(), loopEnabled = !0, eventForwarders = {}, eventHandler = new EventHandler, options = {
        containerType: "div",
        containerClass: "famous-container",
        fpsCap: void 0,
        runLoop: !0,
        appMode: !0
    }, optionsManager = new OptionsManager(options), MAX_DEFER_FRAME_TIME = 10;
    Engine.step = function () {
        currentFrame++, nextTickFrame = currentFrame;
        var currentTime = Date.now();
        if (!(frameTimeLimit && frameTimeLimit > currentTime - lastTime)) {
            var i = 0;
            frameTime = currentTime - lastTime, lastTime = currentTime, eventHandler.emit("prerender");
            for (var numFunctions = nextTickQueue.length; numFunctions--;)nextTickQueue.shift()(currentFrame);
            for (; deferQueue.length && Date.now() - currentTime < MAX_DEFER_FRAME_TIME;)deferQueue.shift().call(this);
            for (i = 0; i < contexts.length; i++)contexts[i].update();
            eventHandler.emit("postrender")
        }
    }, window.requestAnimationFrame(loop), window.addEventListener("resize", handleResize, !1), handleResize();
    var initialized = !1;
    Engine.pipe = function (target) {
        return target.subscribe instanceof Function ? target.subscribe(Engine) : eventHandler.pipe(target)
    }, Engine.unpipe = function (target) {
        return target.unsubscribe instanceof Function ? target.unsubscribe(Engine) : eventHandler.unpipe(target)
    }, Engine.on = function (type, handler) {
        return type in eventForwarders || (eventForwarders[type] = eventHandler.emit.bind(eventHandler, type), addEngineListener(type, eventForwarders[type])), eventHandler.on(type, handler)
    }, Engine.emit = function (type, event) {
        return eventHandler.emit(type, event)
    }, Engine.removeListener = function (type, handler) {
        return eventHandler.removeListener(type, handler)
    }, Engine.getFPS = function () {
        return 1e3 / frameTime
    }, Engine.setFPSCap = function (fps) {
        frameTimeLimit = Math.floor(1e3 / fps)
    }, Engine.getOptions = function (key) {
        return optionsManager.getOptions(key)
    }, Engine.setOptions = function () {
        return optionsManager.setOptions.apply(optionsManager, arguments)
    }, Engine.createContext = function (el) {
        !initialized && options.appMode && Engine.nextTick(initialize);
        var needMountContainer = !1;
        el || (el = document.createElement(options.containerType), el.classList.add(options.containerClass), needMountContainer = !0);
        var context = new Context(el);
        return Engine.registerContext(context), needMountContainer && mount(context, el), context
    }, Engine.registerContext = function (context) {
        return contexts.push(context), context
    }, Engine.getContexts = function () {
        return contexts
    }, Engine.deregisterContext = function (context) {
        var i = contexts.indexOf(context);
        i >= 0 && contexts.splice(i, 1)
    }, Engine.nextTick = function (fn) {
        nextTickQueue.push(fn)
    }, Engine.defer = function (fn) {
        deferQueue.push(fn)
    }, optionsManager.on("change", function (data) {
        "fpsCap" === data.id ? Engine.setFPSCap(data.value) : "runLoop" === data.id && !loopEnabled && data.value && (loopEnabled = !0, window.requestAnimationFrame(loop))
    }), module.exports = Engine
}), define("famous/core/ElementOutput", ["require", "exports", "module", "./Entity", "./EventHandler", "./Transform"], function (require, exports, module) {
    function ElementOutput(element) {
        this._matrix = null, this._opacity = 1, this._origin = null, this._size = null, this._eventOutput = new EventHandler, this._eventOutput.bindThis(this), this.eventForwarder = function (event) {
            this._eventOutput.emit(event.type, event)
        }.bind(this), this.id = Entity.register(this), this._element = null, this._sizeDirty = !1, this._originDirty = !1, this._transformDirty = !1, this._invisible = !1, element && this.attach(element)
    }

    function _addEventListeners(target) {
        for (var i in this._eventOutput.listeners)target.addEventListener(i, this.eventForwarder)
    }

    function _removeEventListeners(target) {
        for (var i in this._eventOutput.listeners)target.removeEventListener(i, this.eventForwarder)
    }

    function _formatCSSTransform(m) {
        m[12] = Math.round(m[12] * devicePixelRatio) / devicePixelRatio, m[13] = Math.round(m[13] * devicePixelRatio) / devicePixelRatio;
        for (var result = "matrix3d(", i = 0; 15 > i; i++)result += m[i] < 1e-6 && m[i] > -1e-6 ? "0," : m[i] + ",";
        return result += m[15] + ")"
    }

    function _formatCSSOrigin(origin) {
        return 100 * origin[0] + "% " + 100 * origin[1] + "%"
    }

    function _xyNotEquals(a, b) {
        return a && b ? a[0] !== b[0] || a[1] !== b[1] : a !== b
    }

    var Entity = require("./Entity"), EventHandler = require("./EventHandler"), Transform = require("./Transform"), usePrefix = !("transform"in document.documentElement.style), devicePixelRatio = window.devicePixelRatio || 1;
    ElementOutput.prototype.on = function (type, fn) {
        this._element && this._element.addEventListener(type, this.eventForwarder), this._eventOutput.on(type, fn)
    }, ElementOutput.prototype.removeListener = function (type, fn) {
        this._eventOutput.removeListener(type, fn)
    }, ElementOutput.prototype.emit = function (type, event) {
        event && !event.origin && (event.origin = this);
        var handled = this._eventOutput.emit(type, event);
        return handled && event && event.stopPropagation && event.stopPropagation(), handled
    }, ElementOutput.prototype.pipe = function (target) {
        return this._eventOutput.pipe(target)
    }, ElementOutput.prototype.unpipe = function (target) {
        return this._eventOutput.unpipe(target)
    }, ElementOutput.prototype.render = function () {
        return this.id
    };
    var _setMatrix;
    _setMatrix = navigator.userAgent.toLowerCase().indexOf("firefox") > -1 ? function (element, matrix) {
        element.style.zIndex = 1e6 * matrix[14] | 0, element.style.transform = _formatCSSTransform(matrix)
    } : usePrefix ? function (element, matrix) {
        element.style.webkitTransform = _formatCSSTransform(matrix)
    } : function (element, matrix) {
        element.style.transform = _formatCSSTransform(matrix)
    };
    var _setOrigin = usePrefix ? function (element, origin) {
        element.style.webkitTransformOrigin = _formatCSSOrigin(origin)
    } : function (element, origin) {
        element.style.transformOrigin = _formatCSSOrigin(origin)
    }, _setInvisible = usePrefix ? function (element) {
        element.style.webkitTransform = "scale3d(0.0001,0.0001,0.0001)", element.style.opacity = 0
    } : function (element) {
        element.style.transform = "scale3d(0.0001,0.0001,0.0001)", element.style.opacity = 0
    };
    ElementOutput.prototype.commit = function (context) {
        var target = this._element;
        if (target) {
            {
                var matrix = context.transform, opacity = context.opacity, origin = context.origin;
                context.size
            }
            if (!matrix && this._matrix)return this._matrix = null, this._opacity = 0, void _setInvisible(target);
            if (_xyNotEquals(this._origin, origin) && (this._originDirty = !0), Transform.notEquals(this._matrix, matrix) && (this._transformDirty = !0), this._invisible && (this._invisible = !1, this._element.style.display = ""), this._opacity !== opacity && (this._opacity = opacity, target.style.opacity = opacity >= 1 ? "0.999999" : opacity), this._transformDirty || this._originDirty || this._sizeDirty) {
                this._sizeDirty && (this._sizeDirty = !1), this._originDirty && (origin ? (this._origin || (this._origin = [0, 0]), this._origin[0] = origin[0], this._origin[1] = origin[1]) : this._origin = null, _setOrigin(target, this._origin), this._originDirty = !1), matrix || (matrix = Transform.identity), this._matrix = matrix;
                var aaMatrix = this._size ? Transform.thenMove(matrix, [-this._size[0] * origin[0], -this._size[1] * origin[1], 0]) : matrix;
                _setMatrix(target, aaMatrix), this._transformDirty = !1
            }
        }
    }, ElementOutput.prototype.cleanup = function () {
        this._element && (this._invisible = !0, this._element.style.display = "none")
    }, ElementOutput.prototype.attach = function (target) {
        this._element = target, _addEventListeners.call(this, target)
    }, ElementOutput.prototype.detach = function () {
        var target = this._element;
        return target && (_removeEventListeners.call(this, target), this._invisible && (this._invisible = !1, this._element.style.display = "")), this._element = null, target
    }, module.exports = ElementOutput
}), define("famous/core/Surface", ["require", "exports", "module", "./ElementOutput"], function (require, exports, module) {
    function Surface(options) {
        ElementOutput.call(this), this.options = {}, this.properties = {}, this.attributes = {}, this.content = "", this.classList = [], this.size = null, this._classesDirty = !0, this._stylesDirty = !0, this._attributesDirty = !0, this._sizeDirty = !0, this._contentDirty = !0, this._trueSizeCheck = !0, this._dirtyClasses = [], options && this.setOptions(options), this._currentTarget = null
    }

    function _cleanupClasses(target) {
        for (var i = 0; i < this._dirtyClasses.length; i++)target.classList.remove(this._dirtyClasses[i]);
        this._dirtyClasses = []
    }

    function _applyStyles(target) {
        for (var n in this.properties)target.style[n] = this.properties[n]
    }

    function _cleanupStyles(target) {
        for (var n in this.properties)target.style[n] = ""
    }

    function _applyAttributes(target) {
        for (var n in this.attributes)target.setAttribute(n, this.attributes[n])
    }

    function _cleanupAttributes(target) {
        for (var n in this.attributes)target.removeAttribute(n)
    }

    function _xyNotEquals(a, b) {
        return a && b ? a[0] !== b[0] || a[1] !== b[1] : a !== b
    }

    var ElementOutput = require("./ElementOutput");
    Surface.prototype = Object.create(ElementOutput.prototype), Surface.prototype.constructor = Surface, Surface.prototype.elementType = "div", Surface.prototype.elementClass = "famous-surface", Surface.prototype.setAttributes = function (attributes) {
        for (var n in attributes) {
            if ("style" === n)throw new Error('Cannot set styles via "setAttributes" as it will break Famo.us.  Use "setProperties" instead.');
            this.attributes[n] = attributes[n]
        }
        this._attributesDirty = !0
    }, Surface.prototype.getAttributes = function () {
        return this.attributes
    }, Surface.prototype.setProperties = function (properties) {
        for (var n in properties)this.properties[n] = properties[n];
        return this._stylesDirty = !0, this
    }, Surface.prototype.getProperties = function () {
        return this.properties
    }, Surface.prototype.addClass = function (className) {
        return this.classList.indexOf(className) < 0 && (this.classList.push(className), this._classesDirty = !0), this
    }, Surface.prototype.removeClass = function (className) {
        var i = this.classList.indexOf(className);
        return i >= 0 && (this._dirtyClasses.push(this.classList.splice(i, 1)[0]), this._classesDirty = !0), this
    }, Surface.prototype.toggleClass = function (className) {
        var i = this.classList.indexOf(className);
        return i >= 0 ? this.removeClass(className) : this.addClass(className), this
    }, Surface.prototype.setClasses = function (classList) {
        var i = 0, removal = [];
        for (i = 0; i < this.classList.length; i++)classList.indexOf(this.classList[i]) < 0 && removal.push(this.classList[i]);
        for (i = 0; i < removal.length; i++)this.removeClass(removal[i]);
        for (i = 0; i < classList.length; i++)this.addClass(classList[i]);
        return this
    }, Surface.prototype.getClassList = function () {
        return this.classList
    }, Surface.prototype.setContent = function (content) {
        return this.content !== content && (this.content = content, this._contentDirty = !0), this
    }, Surface.prototype.getContent = function () {
        return this.content
    }, Surface.prototype.setOptions = function (options) {
        return options.size && this.setSize(options.size), options.classes && this.setClasses(options.classes), options.properties && this.setProperties(options.properties), options.attributes && this.setAttributes(options.attributes), options.content && this.setContent(options.content), this
    }, Surface.prototype.setup = function (allocator) {
        var target = allocator.allocate(this.elementType);
        if (this.elementClass)if (this.elementClass instanceof Array)for (var i = 0; i < this.elementClass.length; i++)target.classList.add(this.elementClass[i]); else target.classList.add(this.elementClass);
        target.style.display = "", this.attach(target), this._opacity = null, this._currentTarget = target, this._stylesDirty = !0, this._classesDirty = !0, this._attributesDirty = !0, this._sizeDirty = !0, this._contentDirty = !0, this._originDirty = !0, this._transformDirty = !0
    }, Surface.prototype.commit = function (context) {
        this._currentTarget || this.setup(context.allocator);
        var target = this._currentTarget, size = context.size;
        if (this._classesDirty) {
            _cleanupClasses.call(this, target);
            for (var classList = this.getClassList(), i = 0; i < classList.length; i++)target.classList.add(classList[i]);
            this._classesDirty = !1, this._trueSizeCheck = !0
        }
        if (this._stylesDirty && (_applyStyles.call(this, target), this._stylesDirty = !1, this._trueSizeCheck = !0), this._attributesDirty && (_applyAttributes.call(this, target), this._attributesDirty = !1, this._trueSizeCheck = !0), this.size) {
            var origSize = context.size;
            if (size = [this.size[0], this.size[1]], void 0 === size[0] && (size[0] = origSize[0]), void 0 === size[1] && (size[1] = origSize[1]), size[0] === !0 || size[1] === !0) {
                if (size[0] === !0)if (this._trueSizeCheck || 0 === this._size[0]) {
                    var width = target.offsetWidth;
                    this._size && this._size[0] !== width && (this._size[0] = width, this._sizeDirty = !0), size[0] = width
                } else this._size && (size[0] = this._size[0]);
                if (size[1] === !0)if (this._trueSizeCheck || 0 === this._size[1]) {
                    var height = target.offsetHeight;
                    this._size && this._size[1] !== height && (this._size[1] = height, this._sizeDirty = !0), size[1] = height
                } else this._size && (size[1] = this._size[1]);
                this._trueSizeCheck = !1
            }
        }
        _xyNotEquals(this._size, size) && (this._size || (this._size = [0, 0]), this._size[0] = size[0], this._size[1] = size[1], this._sizeDirty = !0), this._sizeDirty && (this._size && (target.style.width = this.size && this.size[0] === !0 ? "" : this._size[0] + "px", target.style.height = this.size && this.size[1] === !0 ? "" : this._size[1] + "px"), this._eventOutput.emit("resize")), this._contentDirty && (this.deploy(target), this._eventOutput.emit("deploy"), this._contentDirty = !1, this._trueSizeCheck = !0), ElementOutput.prototype.commit.call(this, context)
    }, Surface.prototype.cleanup = function (allocator) {
        var i = 0, target = this._currentTarget;
        this._eventOutput.emit("recall"), this.recall(target), target.style.display = "none", target.style.opacity = "", target.style.width = "", target.style.height = "", _cleanupStyles.call(this, target), _cleanupAttributes.call(this, target);
        var classList = this.getClassList();
        for (_cleanupClasses.call(this, target), i = 0; i < classList.length; i++)target.classList.remove(classList[i]);
        if (this.elementClass)if (this.elementClass instanceof Array)for (i = 0; i < this.elementClass.length; i++)target.classList.remove(this.elementClass[i]); else target.classList.remove(this.elementClass);
        this.detach(target), this._currentTarget = null, allocator.deallocate(target)
    }, Surface.prototype.deploy = function (target) {
        var content = this.getContent();
        if (content instanceof Node) {
            for (; target.hasChildNodes();)target.removeChild(target.firstChild);
            target.appendChild(content)
        } else target.innerHTML = content
    }, Surface.prototype.recall = function (target) {
        for (var df = document.createDocumentFragment(); target.hasChildNodes();)df.appendChild(target.firstChild);
        this.setContent(df)
    }, Surface.prototype.getSize = function () {
        return this._size ? this._size : this.size
    }, Surface.prototype.setSize = function (size) {
        return this.size = size ? [size[0], size[1]] : null, this._sizeDirty = !0, this
    }, module.exports = Surface
}), define("famous/transitions/TransitionableTransform", ["require", "exports", "module", "./Transitionable", "../core/Transform", "../utilities/Utility"], function (require, exports, module) {
    function TransitionableTransform(transform) {
        this._final = Transform.identity.slice(), this._finalTranslate = [0, 0, 0], this._finalRotate = [0, 0, 0], this._finalSkew = [0, 0, 0], this._finalScale = [1, 1, 1], this.translate = new Transitionable(this._finalTranslate), this.rotate = new Transitionable(this._finalRotate), this.skew = new Transitionable(this._finalSkew), this.scale = new Transitionable(this._finalScale), transform && this.set(transform)
    }

    function _build() {
        return Transform.build({
            translate: this.translate.get(),
            rotate: this.rotate.get(),
            skew: this.skew.get(),
            scale: this.scale.get()
        })
    }

    function _buildFinal() {
        return Transform.build({
            translate: this._finalTranslate,
            rotate: this._finalRotate,
            skew: this._finalSkew,
            scale: this._finalScale
        })
    }

    var Transitionable = require("./Transitionable"), Transform = require("../core/Transform"), Utility = require("../utilities/Utility");
    TransitionableTransform.prototype.setTranslate = function (translate, transition, callback) {
        return this._finalTranslate = translate, this._final = _buildFinal.call(this), this.translate.set(translate, transition, callback), this
    }, TransitionableTransform.prototype.setScale = function (scale, transition, callback) {
        return this._finalScale = scale, this._final = _buildFinal.call(this), this.scale.set(scale, transition, callback), this
    }, TransitionableTransform.prototype.setRotate = function (eulerAngles, transition, callback) {
        return this._finalRotate = eulerAngles, this._final = _buildFinal.call(this), this.rotate.set(eulerAngles, transition, callback), this
    }, TransitionableTransform.prototype.setSkew = function (skewAngles, transition, callback) {
        return this._finalSkew = skewAngles, this._final = _buildFinal.call(this), this.skew.set(skewAngles, transition, callback), this
    }, TransitionableTransform.prototype.set = function (transform, transition, callback) {
        var components = Transform.interpret(transform);
        this._finalTranslate = components.translate, this._finalRotate = components.rotate, this._finalSkew = components.skew, this._finalScale = components.scale, this._final = transform;
        var _callback = callback ? Utility.after(4, callback) : null;
        return this.translate.set(components.translate, transition, _callback), this.rotate.set(components.rotate, transition, _callback), this.skew.set(components.skew, transition, _callback), this.scale.set(components.scale, transition, _callback), this
    }, TransitionableTransform.prototype.setDefaultTransition = function (transition) {
        this.translate.setDefault(transition), this.rotate.setDefault(transition), this.skew.setDefault(transition), this.scale.setDefault(transition)
    }, TransitionableTransform.prototype.get = function () {
        return this.isActive() ? _build.call(this) : this._final
    }, TransitionableTransform.prototype.getFinal = function () {
        return this._final
    }, TransitionableTransform.prototype.isActive = function () {
        return this.translate.isActive() || this.rotate.isActive() || this.scale.isActive() || this.skew.isActive()
    }, TransitionableTransform.prototype.halt = function () {
        return this.translate.halt(), this.rotate.halt(), this.skew.halt(), this.scale.halt(), this._final = this.get(), this._finalTranslate = this.translate.get(), this._finalRotate = this.rotate.get(), this._finalSkew = this.skew.get(), this._finalScale = this.scale.get(), this
    }, module.exports = TransitionableTransform
}), define("famous/core/Modifier", ["require", "exports", "module", "./Transform", "../transitions/Transitionable", "../transitions/TransitionableTransform"], function (require, exports, module) {
    function Modifier(options) {
        this._transformGetter = null, this._opacityGetter = null, this._originGetter = null, this._alignGetter = null, this._sizeGetter = null, this._proportionGetter = null, this._legacyStates = {}, this._output = {
            transform: Transform.identity,
            opacity: 1,
            origin: null,
            align: null,
            size: null,
            proportions: null,
            target: null
        }, options && (options.transform && this.transformFrom(options.transform), void 0 !== options.opacity && this.opacityFrom(options.opacity), options.origin && this.originFrom(options.origin), options.align && this.alignFrom(options.align), options.size && this.sizeFrom(options.size), options.proportions && this.proportionsFrom(options.proportions))
    }

    function _update() {
        this._transformGetter && (this._output.transform = this._transformGetter()), this._opacityGetter && (this._output.opacity = this._opacityGetter()), this._originGetter && (this._output.origin = this._originGetter()), this._alignGetter && (this._output.align = this._alignGetter()), this._sizeGetter && (this._output.size = this._sizeGetter()), this._proportionGetter && (this._output.proportions = this._proportionGetter())
    }

    var Transform = require("./Transform"), Transitionable = require("../transitions/Transitionable"), TransitionableTransform = require("../transitions/TransitionableTransform");
    Modifier.prototype.transformFrom = function (transform) {
        return transform instanceof Function ? this._transformGetter = transform : transform instanceof Object && transform.get ? this._transformGetter = transform.get.bind(transform) : (this._transformGetter = null, this._output.transform = transform), this
    }, Modifier.prototype.opacityFrom = function (opacity) {
        return opacity instanceof Function ? this._opacityGetter = opacity : opacity instanceof Object && opacity.get ? this._opacityGetter = opacity.get.bind(opacity) : (this._opacityGetter = null, this._output.opacity = opacity), this
    }, Modifier.prototype.originFrom = function (origin) {
        return origin instanceof Function ? this._originGetter = origin : origin instanceof Object && origin.get ? this._originGetter = origin.get.bind(origin) : (this._originGetter = null, this._output.origin = origin), this
    }, Modifier.prototype.alignFrom = function (align) {
        return align instanceof Function ? this._alignGetter = align : align instanceof Object && align.get ? this._alignGetter = align.get.bind(align) : (this._alignGetter = null, this._output.align = align), this
    }, Modifier.prototype.sizeFrom = function (size) {
        return size instanceof Function ? this._sizeGetter = size : size instanceof Object && size.get ? this._sizeGetter = size.get.bind(size) : (this._sizeGetter = null, this._output.size = size), this
    }, Modifier.prototype.proportionsFrom = function (proportions) {
        return proportions instanceof Function ? this._proportionGetter = proportions : proportions instanceof Object && proportions.get ? this._proportionGetter = proportions.get.bind(proportions) : (this._proportionGetter = null, this._output.proportions = proportions), this
    }, Modifier.prototype.setTransform = function (transform, transition, callback) {
        return transition || this._legacyStates.transform ? (this._legacyStates.transform || (this._legacyStates.transform = new TransitionableTransform(this._output.transform)), this._transformGetter || this.transformFrom(this._legacyStates.transform), this._legacyStates.transform.set(transform, transition, callback), this) : this.transformFrom(transform)
    }, Modifier.prototype.setOpacity = function (opacity, transition, callback) {
        return transition || this._legacyStates.opacity ? (this._legacyStates.opacity || (this._legacyStates.opacity = new Transitionable(this._output.opacity)), this._opacityGetter || this.opacityFrom(this._legacyStates.opacity), this._legacyStates.opacity.set(opacity, transition, callback)) : this.opacityFrom(opacity)
    }, Modifier.prototype.setOrigin = function (origin, transition, callback) {
        return transition || this._legacyStates.origin ? (this._legacyStates.origin || (this._legacyStates.origin = new Transitionable(this._output.origin || [0, 0])), this._originGetter || this.originFrom(this._legacyStates.origin), this._legacyStates.origin.set(origin, transition, callback), this) : this.originFrom(origin)
    }, Modifier.prototype.setAlign = function (align, transition, callback) {
        return transition || this._legacyStates.align ? (this._legacyStates.align || (this._legacyStates.align = new Transitionable(this._output.align || [0, 0])), this._alignGetter || this.alignFrom(this._legacyStates.align), this._legacyStates.align.set(align, transition, callback), this) : this.alignFrom(align)
    }, Modifier.prototype.setSize = function (size, transition, callback) {
        return size && (transition || this._legacyStates.size) ? (this._legacyStates.size || (this._legacyStates.size = new Transitionable(this._output.size || [0, 0])), this._sizeGetter || this.sizeFrom(this._legacyStates.size), this._legacyStates.size.set(size, transition, callback), this) : this.sizeFrom(size)
    }, Modifier.prototype.setProportions = function (proportions, transition, callback) {
        return proportions && (transition || this._legacyStates.proportions) ? (this._legacyStates.proportions || (this._legacyStates.proportions = new Transitionable(this._output.proportions || [0, 0])), this._proportionGetter || this.proportionsFrom(this._legacyStates.proportions), this._legacyStates.proportions.set(proportions, transition, callback), this) : this.proportionsFrom(proportions)
    }, Modifier.prototype.halt = function () {
        this._legacyStates.transform && this._legacyStates.transform.halt(), this._legacyStates.opacity && this._legacyStates.opacity.halt(), this._legacyStates.origin && this._legacyStates.origin.halt(), this._legacyStates.align && this._legacyStates.align.halt(), this._legacyStates.size && this._legacyStates.size.halt(), this._legacyStates.proportions && this._legacyStates.proportions.halt(), this._transformGetter = null, this._opacityGetter = null, this._originGetter = null, this._alignGetter = null, this._sizeGetter = null, this._proportionGetter = null
    }, Modifier.prototype.getTransform = function () {
        return this._transformGetter()
    }, Modifier.prototype.getFinalTransform = function () {
        return this._legacyStates.transform ? this._legacyStates.transform.getFinal() : this._output.transform
    }, Modifier.prototype.getOpacity = function () {
        return this._opacityGetter()
    }, Modifier.prototype.getOrigin = function () {
        return this._originGetter()
    }, Modifier.prototype.getAlign = function () {
        return this._alignGetter()
    }, Modifier.prototype.getSize = function () {
        return this._sizeGetter ? this._sizeGetter() : this._output.size
    }, Modifier.prototype.getProportions = function () {
        return this._proportionGetter ? this._proportionGetter() : this._output.proportions
    }, Modifier.prototype.modify = function (target) {
        return _update.call(this), this._output.target = target, this._output
    }, module.exports = Modifier
}), define("famous/core/View", ["require", "exports", "module", "./EventHandler", "./OptionsManager", "./RenderNode", "../utilities/Utility"], function (require, exports, module) {
    function View(options) {
        this._node = new RenderNode, this._eventInput = new EventHandler, this._eventOutput = new EventHandler, EventHandler.setInputHandler(this, this._eventInput), EventHandler.setOutputHandler(this, this._eventOutput), this.options = Utility.clone(this.constructor.DEFAULT_OPTIONS || View.DEFAULT_OPTIONS), this._optionsManager = new OptionsManager(this.options), options && this.setOptions(options)
    }

    var EventHandler = require("./EventHandler"), OptionsManager = require("./OptionsManager"), RenderNode = require("./RenderNode"), Utility = require("../utilities/Utility");
    View.DEFAULT_OPTIONS = {}, View.prototype.getOptions = function (key) {
        return this._optionsManager.getOptions(key)
    }, View.prototype.setOptions = function (options) {
        this._optionsManager.patch(options)
    }, View.prototype.add = function () {
        return this._node.add.apply(this._node, arguments)
    }, View.prototype._add = View.prototype.add, View.prototype.render = function () {
        return this._node.render()
    }, View.prototype.getSize = function () {
        return this._node && this._node.getSize ? this._node.getSize.apply(this._node, arguments) || this.options.size : this.options.size
    }, module.exports = View
}), define("famous/inputs/SyncUtils", ["require", "exports", "module"], function (require, exports, module) {
    module.exports = {
        getTimeHistoryPosition: function (history, timeSampleDuration) {
            for (var lastHist, hist, diffTime, len = history.length - 1, index = len, searching = !0, timeSearched = 0; searching;) {
                if (hist = history[index], 0 > index)return lastHist;
                if (hist && lastHist && (diffTime = lastHist.timestamp - hist.timestamp, timeSearched += diffTime, timeSearched >= timeSampleDuration))return searching = !1, hist;
                index--, lastHist = hist
            }
        }
    }
}), define("famous/inputs/MouseSync", ["require", "exports", "module", "../core/EventHandler", "../core/OptionsManager", "./SyncUtils"], function (require, exports, module) {
    function MouseSync(options) {
        this.options = Object.create(MouseSync.DEFAULT_OPTIONS), this._optionsManager = new OptionsManager(this.options), options && this.setOptions(options), this._eventInput = new EventHandler, this._eventOutput = new EventHandler, EventHandler.setInputHandler(this, this._eventInput), EventHandler.setOutputHandler(this, this._eventOutput), this._eventInput.on("mousedown", _handleStart.bind(this)), this._eventInput.on("mousemove", _handleMove.bind(this)), this._eventInput.on("mouseup", _handleEnd.bind(this)), this.options.propogate ? this._eventInput.on("mouseleave", _handleLeave.bind(this)) : this._eventInput.on("mouseleave", _handleEnd.bind(this)), this.options.clickThreshold && window.addEventListener("click", function (event) {
            Math.sqrt(Math.pow(this._displacement[0], 2) + Math.pow(this._displacement[1], 2)) > this.options.clickThreshold && event.stopPropagation()
        }.bind(this), !0), this._payload = {
            delta: null,
            position: null,
            velocity: null,
            clientX: 0,
            clientY: 0,
            offsetX: 0,
            offsetY: 0
        }, this._positionHistory = [], this._position = null, this._down = !1, this._moved = !1, this._displacement = [0, 0], this._documentActive = !1
    }

    function _handleStart(event) {
        var delta, velocity;
        this.options.preventDefault && event.preventDefault();
        var x = event.clientX, y = event.clientY, currTime = Date.now();
        this._down = !0, this._move = !1, void 0 !== this.options.direction ? (this._position = 0, delta = 0, velocity = 0) : (this._position = [0, 0], delta = [0, 0], velocity = [0, 0]), this.options.clickThreshold && (this._displacement = [0, 0]);
        var payload = this._payload;
        payload.delta = delta, payload.position = this._position, payload.velocity = velocity, payload.clientX = x, payload.clientY = y, payload.offsetX = event.offsetX, payload.offsetY = event.offsetY, this._positionHistory.push({
            position: payload.position.slice ? payload.position.slice(0) : payload.position,
            clientPosition: [x, y],
            timestamp: currTime
        }), this._eventOutput.emit("start", payload), this._documentActive = !1
    }

    function _handleMove(event) {
        if (0 !== this._positionHistory.length) {
            var payload = calculatePayload.call(this, event);
            this._eventOutput.emit("update", payload), this._move = !0
        }
    }

    function _handleEnd(event) {
        if (this._down) {
            var payload = calculatePayload.call(this, event);
            this._eventOutput.emit("end", payload), this._down = !1, this._move = !1, this._positionHistory = []
        }
    }

    function _handleLeave() {
        if (this._down && this._move && !this._documentActive) {
            var boundMove = _handleMove.bind(this), boundEnd = function (event) {
                _handleEnd.call(this, event), document.removeEventListener("mousemove", boundMove), document.removeEventListener("mouseup", boundEnd)
            }.bind(this);
            document.addEventListener("mousemove", boundMove), document.addEventListener("mouseup", boundEnd), this._documentActive = !0
        }
    }

    function calculatePayload(event) {
        var nextVel, nextDelta, payload = this._payload, scale = this.options.scale, x = event.clientX, y = event.clientY, currTime = Date.now(), lastPos = this._positionHistory[this._positionHistory.length - 1], diffX = x * scale - lastPos.clientPosition[0], diffY = y * scale - lastPos.clientPosition[1];
        this.options.rails && (Math.abs(diffX) > Math.abs(diffY) ? diffY = 0 : diffX = 0), this.options.direction === MouseSync.DIRECTION_X ? (nextDelta = diffX, this._position += nextDelta) : this.options.direction === MouseSync.DIRECTION_Y ? (nextDelta = diffY, this._position += nextDelta) : (nextDelta = [diffX, diffY], this._position[0] += diffX, this._position[1] += diffY), this.options.clickThreshold !== !1 && (this._displacement[0] += diffX, this._displacement[1] += diffY), payload.delta = nextDelta, payload.position = this._position, payload.clientX = x, payload.clientY = y, payload.offsetX = event.offsetX, payload.offsetY = event.offsetY, this._positionHistory.length === this.options.velocitySampleLength && this._positionHistory.shift(), this._positionHistory.push({
            position: payload.position.slice ? payload.position.slice(0) : payload.position,
            clientPosition: [x, y],
            timestamp: currTime
        });
        var lastPositionHistory = SyncUtils.getTimeHistoryPosition(this._positionHistory, this.options.timeSampleDuration), diffTime = Math.max(currTime - lastPositionHistory.timestamp, MINIMUM_TICK_TIME);
        return nextVel = void 0 !== this.options.direction ? scale * (this._position - lastPositionHistory.position) / diffTime : [scale * (this._position[0] - lastPositionHistory.position[0]) / diffTime, scale * (this._position[1] - lastPositionHistory.position[1]) / diffTime], payload.velocity = nextVel, payload
    }

    var EventHandler = require("../core/EventHandler"), OptionsManager = require("../core/OptionsManager"), SyncUtils = require("./SyncUtils");
    MouseSync.DEFAULT_OPTIONS = {
        clickThreshold: void 0,
        direction: void 0,
        rails: !1,
        scale: 1,
        propogate: !0,
        velocitySampleLength: 10,
        timeSampleDuration: 400,
        preventDefault: !0
    }, MouseSync.DIRECTION_X = 0, MouseSync.DIRECTION_Y = 1;
    var MINIMUM_TICK_TIME = 8;
    MouseSync.prototype.getOptions = function () {
        return this.options
    }, MouseSync.prototype.setOptions = function (options) {
        return this._optionsManager.setOptions(options)
    }, module.exports = MouseSync
}), define("famous/inputs/GenericSync", ["require", "exports", "module", "../core/EventHandler"], function (require, exports, module) {
    function GenericSync(syncs, options) {
        this._eventInput = new EventHandler, this._eventOutput = new EventHandler, EventHandler.setInputHandler(this, this._eventInput), EventHandler.setOutputHandler(this, this._eventOutput), this._syncs = {}, syncs && this.addSync(syncs), options && this.setOptions(options)
    }

    function _addSingleSync(key, options) {
        registry[key] && (this._syncs[key] = new registry[key](options), this.pipeSync(key))
    }

    var EventHandler = require("../core/EventHandler");
    GenericSync.DIRECTION_X = 0, GenericSync.DIRECTION_Y = 1, GenericSync.DIRECTION_Z = 2;
    var registry = {};
    GenericSync.register = function (syncObject) {
        for (var key in syncObject)if (registry[key]) {
            if (registry[key] !== syncObject[key])throw new Error("Conflicting sync classes for key: " + key)
        } else registry[key] = syncObject[key]
    }, GenericSync.prototype.setOptions = function (options) {
        for (var key in this._syncs)this._syncs[key].setOptions(options)
    }, GenericSync.prototype.pipeSync = function (key) {
        var sync = this._syncs[key];
        this._eventInput.pipe(sync), sync.pipe(this._eventOutput)
    }, GenericSync.prototype.unpipeSync = function (key) {
        var sync = this._syncs[key];
        this._eventInput.unpipe(sync), sync.unpipe(this._eventOutput)
    }, GenericSync.prototype.addSync = function (syncs) {
        if (syncs instanceof Array)for (var i = 0; i < syncs.length; i++)_addSingleSync.call(this, syncs[i]); else if (syncs instanceof Object)for (var key in syncs)_addSingleSync.call(this, key, syncs[key])
    }, module.exports = GenericSync
}), define("famous/views/HeaderFooterLayout", ["require", "exports", "module", "../core/Entity", "../core/RenderNode", "../core/Transform", "../core/OptionsManager"], function (require, exports, module) {
    function HeaderFooterLayout(options) {
        this.options = Object.create(HeaderFooterLayout.DEFAULT_OPTIONS), this._optionsManager = new OptionsManager(this.options), options && this.setOptions(options), this._entityId = Entity.register(this), this.header = new RenderNode, this.footer = new RenderNode, this.content = new RenderNode
    }

    function _resolveNodeSize(node, defaultSize) {
        var nodeSize = node.getSize();
        return nodeSize ? nodeSize[this.options.direction] : defaultSize
    }

    function _outputTransform(offset) {
        return this.options.direction === HeaderFooterLayout.DIRECTION_X ? Transform.translate(offset, 0, 0) : Transform.translate(0, offset, 0)
    }

    function _finalSize(directionSize, size) {
        return this.options.direction === HeaderFooterLayout.DIRECTION_X ? [directionSize, size[1]] : [size[0], directionSize]
    }

    var Entity = require("../core/Entity"), RenderNode = require("../core/RenderNode"), Transform = require("../core/Transform"), OptionsManager = require("../core/OptionsManager");
    HeaderFooterLayout.DIRECTION_X = 0, HeaderFooterLayout.DIRECTION_Y = 1, HeaderFooterLayout.DEFAULT_OPTIONS = {
        direction: HeaderFooterLayout.DIRECTION_Y,
        headerSize: void 0,
        footerSize: void 0,
        defaultHeaderSize: 0,
        defaultFooterSize: 0
    }, HeaderFooterLayout.prototype.render = function () {
        return this._entityId
    }, HeaderFooterLayout.prototype.setOptions = function (options) {
        return this._optionsManager.setOptions(options)
    }, HeaderFooterLayout.prototype.commit = function (context) {
        var transform = context.transform, origin = context.origin, size = context.size, opacity = context.opacity, headerSize = void 0 !== this.options.headerSize ? this.options.headerSize : _resolveNodeSize.call(this, this.header, this.options.defaultHeaderSize), footerSize = void 0 !== this.options.footerSize ? this.options.footerSize : _resolveNodeSize.call(this, this.footer, this.options.defaultFooterSize), contentSize = size[this.options.direction] - headerSize - footerSize;
        size && (transform = Transform.moveThen([-size[0] * origin[0], -size[1] * origin[1], 0], transform));
        var result = [{
            size: _finalSize.call(this, headerSize, size),
            target: this.header.render()
        }, {
            transform: _outputTransform.call(this, headerSize),
            size: _finalSize.call(this, contentSize, size),
            target: this.content.render()
        }, {
            transform: _outputTransform.call(this, headerSize + contentSize),
            size: _finalSize.call(this, footerSize, size),
            target: this.footer.render()
        }];
        return {transform: transform, opacity: opacity, size: size, target: result}
    }, module.exports = HeaderFooterLayout
}), define("famous/utilities/Timer", ["require", "exports", "module", "../core/Engine"], function (require, exports, module) {
    function addTimerFunction(fn) {
        return FamousEngine.on(_event, fn), fn
    }

    function setTimeout(fn, duration) {
        var t = getTime(), callback = function () {
            var t2 = getTime();
            t2 - t >= duration && (fn.apply(this, arguments), FamousEngine.removeListener(_event, callback))
        };
        return addTimerFunction(callback)
    }

    function setInterval(fn, duration) {
        var t = getTime(), callback = function () {
            var t2 = getTime();
            t2 - t >= duration && (fn.apply(this, arguments), t = getTime())
        };
        return addTimerFunction(callback)
    }

    function after(fn, numTicks) {
        if (void 0 === numTicks)return void 0;
        var callback = function () {
            numTicks--, 0 >= numTicks && (fn.apply(this, arguments), clear(callback))
        };
        return addTimerFunction(callback)
    }

    function every(fn, numTicks) {
        numTicks = numTicks || 1;
        var initial = numTicks, callback = function () {
            numTicks--, 0 >= numTicks && (fn.apply(this, arguments), numTicks = initial)
        };
        return addTimerFunction(callback)
    }

    function clear(fn) {
        FamousEngine.removeListener(_event, fn)
    }

    function debounce(func, wait) {
        var timeout, ctx, timestamp, result, args;
        return function () {
            ctx = this, args = arguments, timestamp = getTime();
            var fn = function () {
                var last = getTime - timestamp;
                wait > last ? timeout = setTimeout(fn, wait - last) : (timeout = null, result = func.apply(ctx, args))
            };
            return clear(timeout), timeout = setTimeout(fn, wait), result
        }
    }

    var FamousEngine = require("../core/Engine"), _event = "prerender", getTime = window.performance && window.performance.now ? function () {
        return window.performance.now()
    } : function () {
        return Date.now()
    };
    module.exports = {
        setTimeout: setTimeout,
        setInterval: setInterval,
        debounce: debounce,
        after: after,
        every: every,
        clear: clear
    }
}), define("views/NavigationView", ["require", "exports", "module", "famous/core/Surface", "famous/core/Modifier", "famous/core/Transform", "famous/core/View"], function (require, exports, module) {
    function NavigationView() {
        View.apply(this, arguments), _createIcon.call(this)
    }

    function _createIcon() {
        var iconSurface = new Surface({content: '<img width="191" src="' + this.options.iconUrl + '"/>'});
        this._add(iconSurface)
    }

    var Surface = require("famous/core/Surface"), View = (require("famous/core/Modifier"), require("famous/core/Transform"), require("famous/core/View"));
    NavigationView.prototype = Object.create(View.prototype), NavigationView.prototype.constructor = NavigationView, NavigationView.DEFAULT_OPTIONS = {
        width: null,
        height: null,
        iconUrl: null
    }, module.exports = NavigationView
}), define("views/MenuView", ["require", "exports", "module", "famous/core/Surface", "famous/core/Modifier", "famous/core/Transform", "famous/core/View", "famous/utilities/Timer", "./NavigationView"], function (require, exports, module) {
    function MenuView() {
        View.apply(this, arguments), _createBacking.call(this), _createNavigationViews.call(this)
    }

    function _createBacking() {
        var backSurface = new Surface({
            size: [this.options.width, this.options.height],
            properties: {backgroundColor: "#595153"}
        });
        this._add(backSurface)
    }

    function _createNavigationViews() {
        this.navModifiers = [];
        for (var navData = [{iconUrl: "img/nav-icons/home.png"}, {iconUrl: "img/nav-icons/about-us.png"}, {iconUrl: "img/nav-icons/demographics.png"}, {iconUrl: "img/nav-icons/clients.png"}, {iconUrl: "img/nav-icons/radio.png"}, {iconUrl: "img/nav-icons/contact-us.png"}], i = 0; i < navData.length; i++) {
            var navView = new NavigationView({
                width: this.options.navWidth,
                height: this.options.navHeight,
                iconUrl: navData[i].iconUrl
            }), yOffset = this.options.topOffset + this.options.navItemOffset * i, navModifier = new Modifier({transform: Transform.translate(0, yOffset, 0)});
            this.navModifiers.push(navModifier), this._add(navModifier).add(navView)
        }
    }

    var Surface = require("famous/core/Surface"), Modifier = require("famous/core/Modifier"), Transform = require("famous/core/Transform"), View = require("famous/core/View"), Timer = require("famous/utilities/Timer"), NavigationView = require("./NavigationView");
    MenuView.prototype = Object.create(View.prototype), MenuView.prototype.constructor = MenuView, MenuView.prototype.resetNavItems = function () {
        for (var i = 0; i < this.navModifiers.length; i++) {
            var initX = -this.options.navWidth / 4, initY = this.options.topOffset + this.options.navItemOffset * i + 2 * this.options.navHeight;
            this.navModifiers[i].setOpacity(0), this.navModifiers[i].setTransform(Transform.translate(initX, initY, 0))
        }
    }, MenuView.prototype.animateNavItems = function () {
        this.resetNavItems();
        for (var i = 0; i < this.navModifiers.length; i++)Timer.setTimeout(function (i) {
            var yOffset = this.options.topOffset + this.options.navItemOffset * i;
            this.navModifiers[i].setOpacity(1, {
                duration: this.options.duration,
                curve: "easeOut"
            }), this.navModifiers[i].setTransform(Transform.translate(0, yOffset, 0), {
                duration: this.options.duration,
                curve: "easeOut"
            })
        }.bind(this, i), i * this.options.staggerDelay)
    }, MenuView.DEFAULT_OPTIONS = {
        navWidth: 191,
        navHeight: 81,
        topOffset: 10,
        navItemOffset: 90,
        duration: 400,
        staggerDelay: 35
    }, module.exports = MenuView
}), define("famous/physics/PhysicsEngine", ["require", "exports", "module", "../core/EventHandler"], function (require, exports, module) {
    function PhysicsEngine(options) {
        this.options = Object.create(PhysicsEngine.DEFAULT_OPTIONS), options && this.setOptions(options), this._particles = [], this._bodies = [], this._agentData = {}, this._forces = [], this._constraints = [], this._buffer = 0, this._prevTime = now(), this._isSleeping = !1, this._eventHandler = null, this._currAgentId = 0, this._hasBodies = !1, this._eventHandler = null
    }

    function _mapAgentArray(agent) {
        return agent.applyForce ? this._forces : agent.applyConstraint ? this._constraints : void 0
    }

    function _attachOne(agent, targets, source) {
        return void 0 === targets && (targets = this.getParticlesAndBodies()), targets instanceof Array || (targets = [targets]), agent.on("change", this.wake.bind(this)), this._agentData[this._currAgentId] = {
            agent: agent,
            id: this._currAgentId,
            targets: targets,
            source: source
        }, _mapAgentArray.call(this, agent).push(this._currAgentId), this._currAgentId++
    }

    function _getAgentData(id) {
        return this._agentData[id]
    }

    function _updateForce(index) {
        var boundAgent = _getAgentData.call(this, this._forces[index]);
        boundAgent.agent.applyForce(boundAgent.targets, boundAgent.source)
    }

    function _updateForces() {
        for (var index = this._forces.length - 1; index > -1; index--)_updateForce.call(this, index)
    }

    function _updateConstraint(index, dt) {
        var boundAgent = this._agentData[this._constraints[index]];
        return boundAgent.agent.applyConstraint(boundAgent.targets, boundAgent.source, dt)
    }

    function _updateConstraints(dt) {
        for (var iteration = 0; iteration < this.options.constraintSteps;) {
            for (var index = this._constraints.length - 1; index > -1; index--)_updateConstraint.call(this, index, dt);
            iteration++
        }
    }

    function _updateVelocities(body, dt) {
        body.integrateVelocity(dt), this.options.velocityCap && body.velocity.cap(this.options.velocityCap).put(body.velocity)
    }

    function _updateAngularVelocities(body, dt) {
        body.integrateAngularMomentum(dt), body.updateAngularVelocity(), this.options.angularVelocityCap && body.angularVelocity.cap(this.options.angularVelocityCap).put(body.angularVelocity)
    }

    function _updateOrientations(body, dt) {
        body.integrateOrientation(dt)
    }

    function _updatePositions(body, dt) {
        body.integratePosition(dt), body.emit(_events.update, body)
    }

    function _integrate(dt) {
        _updateForces.call(this, dt), this.forEach(_updateVelocities, dt), this.forEachBody(_updateAngularVelocities, dt), _updateConstraints.call(this, dt), this.forEachBody(_updateOrientations, dt), this.forEach(_updatePositions, dt)
    }

    function _getParticlesEnergy() {
        var energy = 0, particleEnergy = 0;
        return this.forEach(function (particle) {
            particleEnergy = particle.getEnergy(), energy += particleEnergy
        }), energy
    }

    function _getAgentsEnergy() {
        var energy = 0;
        for (var id in this._agentData)energy += this.getAgentEnergy(id);
        return energy
    }

    var EventHandler = require("../core/EventHandler"), TIMESTEP = 17, MIN_TIME_STEP = 1e3 / 120, MAX_TIME_STEP = 17, now = Date.now, _events = {
        start: "start",
        update: "update",
        end: "end"
    };
    PhysicsEngine.DEFAULT_OPTIONS = {
        constraintSteps: 1,
        sleepTolerance: 1e-7,
        velocityCap: void 0,
        angularVelocityCap: void 0
    }, PhysicsEngine.prototype.setOptions = function (opts) {
        for (var key in opts)this.options[key] && (this.options[key] = opts[key])
    }, PhysicsEngine.prototype.addBody = function (body) {
        return body._engine = this, body.isBody ? (this._bodies.push(body), this._hasBodies = !0) : this._particles.push(body), body.on("start", this.wake.bind(this)), body
    }, PhysicsEngine.prototype.removeBody = function (body) {
        var array = body.isBody ? this._bodies : this._particles, index = array.indexOf(body);
        if (index > -1) {
            for (var agentKey in this._agentData)this._agentData.hasOwnProperty(agentKey) && this.detachFrom(this._agentData[agentKey].id, body);
            array.splice(index, 1)
        }
        0 === this.getBodies().length && (this._hasBodies = !1)
    }, PhysicsEngine.prototype.attach = function (agents, targets, source) {
        if (this.wake(), agents instanceof Array) {
            for (var agentIDs = [], i = 0; i < agents.length; i++)agentIDs[i] = _attachOne.call(this, agents[i], targets, source);
            return agentIDs
        }
        return _attachOne.call(this, agents, targets, source)
    }, PhysicsEngine.prototype.attachTo = function (agentID, target) {
        _getAgentData.call(this, agentID).targets.push(target)
    }, PhysicsEngine.prototype.detach = function (id) {
        var agent = this.getAgent(id), agentArray = _mapAgentArray.call(this, agent), index = agentArray.indexOf(id);
        agentArray.splice(index, 1), delete this._agentData[id]
    }, PhysicsEngine.prototype.detachFrom = function (id, target) {
        var boundAgent = _getAgentData.call(this, id);
        if (boundAgent.source === target)this.detach(id); else {
            var targets = boundAgent.targets, index = targets.indexOf(target);
            index > -1 && targets.splice(index, 1)
        }
    }, PhysicsEngine.prototype.detachAll = function () {
        this._agentData = {}, this._forces = [], this._constraints = [], this._currAgentId = 0
    }, PhysicsEngine.prototype.getAgent = function (id) {
        return _getAgentData.call(this, id).agent
    }, PhysicsEngine.prototype.getParticles = function () {
        return this._particles
    }, PhysicsEngine.prototype.getBodies = function () {
        return this._bodies
    }, PhysicsEngine.prototype.getParticlesAndBodies = function () {
        return this.getParticles().concat(this.getBodies())
    }, PhysicsEngine.prototype.forEachParticle = function (fn, dt) {
        for (var particles = this.getParticles(), index = 0, len = particles.length; len > index; index++)fn.call(this, particles[index], dt)
    }, PhysicsEngine.prototype.forEachBody = function (fn, dt) {
        if (this._hasBodies)for (var bodies = this.getBodies(), index = 0, len = bodies.length; len > index; index++)fn.call(this, bodies[index], dt)
    }, PhysicsEngine.prototype.forEach = function (fn, dt) {
        this.forEachParticle(fn, dt), this.forEachBody(fn, dt)
    }, PhysicsEngine.prototype.getAgentEnergy = function (agentId) {
        var agentData = _getAgentData.call(this, agentId);
        return agentData.agent.getEnergy(agentData.targets, agentData.source)
    }, PhysicsEngine.prototype.getEnergy = function () {
        return _getParticlesEnergy.call(this) + _getAgentsEnergy.call(this)
    }, PhysicsEngine.prototype.step = function () {
        if (!this.isSleeping()) {
            var currTime = now(), dtFrame = currTime - this._prevTime;
            this._prevTime = currTime, MIN_TIME_STEP > dtFrame || (dtFrame > MAX_TIME_STEP && (dtFrame = MAX_TIME_STEP), _integrate.call(this, TIMESTEP), this.emit(_events.update, this), this.getEnergy() < this.options.sleepTolerance && this.sleep())
        }
    }, PhysicsEngine.prototype.isSleeping = function () {
        return this._isSleeping
    }, PhysicsEngine.prototype.isActive = function () {
        return !this._isSleeping
    }, PhysicsEngine.prototype.sleep = function () {
        this._isSleeping || (this.forEach(function (body) {
            body.sleep()
        }), this.emit(_events.end, this), this._isSleeping = !0)
    }, PhysicsEngine.prototype.wake = function () {
        this._isSleeping && (this._prevTime = now(), this.emit(_events.start, this), this._isSleeping = !1)
    }, PhysicsEngine.prototype.emit = function (type, data) {
        null !== this._eventHandler && this._eventHandler.emit(type, data)
    }, PhysicsEngine.prototype.on = function (event, fn) {
        null === this._eventHandler && (this._eventHandler = new EventHandler), this._eventHandler.on(event, fn)
    }, module.exports = PhysicsEngine
}), define("famous/math/Vector", ["require", "exports", "module"], function (require, exports, module) {
    function Vector(x, y, z) {
        return 1 === arguments.length && void 0 !== x ? this.set(x) : (this.x = x || 0, this.y = y || 0, this.z = z || 0), this
    }

    function _setXYZ(x, y, z) {
        return this.x = x, this.y = y, this.z = z, this
    }

    function _setFromArray(v) {
        return _setXYZ.call(this, v[0], v[1], v[2] || 0)
    }

    function _setFromVector(v) {
        return _setXYZ.call(this, v.x, v.y, v.z)
    }

    function _setFromNumber(x) {
        return _setXYZ.call(this, x, 0, 0)
    }

    var _register = new Vector(0, 0, 0);
    Vector.prototype.add = function (v) {
        return _setXYZ.call(_register, this.x + v.x, this.y + v.y, this.z + v.z)
    }, Vector.prototype.sub = function (v) {
        return _setXYZ.call(_register, this.x - v.x, this.y - v.y, this.z - v.z)
    }, Vector.prototype.mult = function (r) {
        return _setXYZ.call(_register, r * this.x, r * this.y, r * this.z)
    }, Vector.prototype.div = function (r) {
        return this.mult(1 / r)
    }, Vector.prototype.cross = function (v) {
        var x = this.x, y = this.y, z = this.z, vx = v.x, vy = v.y, vz = v.z;
        return _setXYZ.call(_register, z * vy - y * vz, x * vz - z * vx, y * vx - x * vy)
    }, Vector.prototype.equals = function (v) {
        return v.x === this.x && v.y === this.y && v.z === this.z
    }, Vector.prototype.rotateX = function (theta) {
        var x = this.x, y = this.y, z = this.z, cosTheta = Math.cos(theta), sinTheta = Math.sin(theta);
        return _setXYZ.call(_register, x, y * cosTheta - z * sinTheta, y * sinTheta + z * cosTheta)
    }, Vector.prototype.rotateY = function (theta) {
        var x = this.x, y = this.y, z = this.z, cosTheta = Math.cos(theta), sinTheta = Math.sin(theta);
        return _setXYZ.call(_register, z * sinTheta + x * cosTheta, y, z * cosTheta - x * sinTheta)
    }, Vector.prototype.rotateZ = function (theta) {
        var x = this.x, y = this.y, z = this.z, cosTheta = Math.cos(theta), sinTheta = Math.sin(theta);
        return _setXYZ.call(_register, x * cosTheta - y * sinTheta, x * sinTheta + y * cosTheta, z)
    }, Vector.prototype.dot = function (v) {
        return this.x * v.x + this.y * v.y + this.z * v.z
    }, Vector.prototype.normSquared = function () {
        return this.dot(this)
    }, Vector.prototype.norm = function () {
        return Math.sqrt(this.normSquared())
    }, Vector.prototype.normalize = function (length) {
        0 === arguments.length && (length = 1);
        var norm = this.norm();
        return norm > 1e-7 ? _setFromVector.call(_register, this.mult(length / norm)) : _setXYZ.call(_register, length, 0, 0)
    }, Vector.prototype.clone = function () {
        return new Vector(this)
    }, Vector.prototype.isZero = function () {
        return !(this.x || this.y || this.z)
    }, Vector.prototype.set = function (v) {
        return v instanceof Array ? _setFromArray.call(this, v) : "number" == typeof v ? _setFromNumber.call(this, v) : _setFromVector.call(this, v)
    }, Vector.prototype.setXYZ = function () {
        return _setXYZ.apply(this, arguments)
    }, Vector.prototype.set1D = function (x) {
        return _setFromNumber.call(this, x)
    }, Vector.prototype.put = function (v) {
        this === _register ? _setFromVector.call(v, _register) : _setFromVector.call(v, this)
    }, Vector.prototype.clear = function () {
        return _setXYZ.call(this, 0, 0, 0)
    }, Vector.prototype.cap = function cap(cap) {
        if (1 / 0 === cap)return _setFromVector.call(_register, this);
        var norm = this.norm();
        return norm > cap ? _setFromVector.call(_register, this.mult(cap / norm)) : _setFromVector.call(_register, this)
    }, Vector.prototype.project = function (n) {
        return n.mult(this.dot(n))
    }, Vector.prototype.reflectAcross = function (n) {
        return n.normalize().put(n), _setFromVector(_register, this.sub(this.project(n).mult(2)))
    }, Vector.prototype.get = function () {
        return [this.x, this.y, this.z]
    }, Vector.prototype.get1D = function () {
        return this.x
    }, module.exports = Vector
}), define("famous/physics/integrators/SymplecticEuler", ["require", "exports", "module"], function (require, exports, module) {
    var SymplecticEuler = {};
    SymplecticEuler.integrateVelocity = function (body, dt) {
        var v = body.velocity, w = body.inverseMass, f = body.force;
        f.isZero() || (v.add(f.mult(dt * w)).put(v), f.clear())
    }, SymplecticEuler.integratePosition = function (body, dt) {
        var p = body.position, v = body.velocity;
        p.add(v.mult(dt)).put(p)
    }, SymplecticEuler.integrateAngularMomentum = function (body, dt) {
        var L = body.angularMomentum, t = body.torque;
        t.isZero() || (L.add(t.mult(dt)).put(L), t.clear())
    }, SymplecticEuler.integrateOrientation = function (body, dt) {
        var q = body.orientation, w = body.angularVelocity;
        w.isZero() || q.add(q.multiply(w).scalarMultiply(.5 * dt)).put(q)
    }, module.exports = SymplecticEuler
}), define("famous/physics/bodies/Particle", ["require", "exports", "module", "../../math/Vector", "../../core/Transform", "../../core/EventHandler", "../integrators/SymplecticEuler"], function (require, exports, module) {
    function Particle(options) {
        options = options || {};
        var defaults = Particle.DEFAULT_OPTIONS;
        this.position = new Vector, this.velocity = new Vector, this.force = new Vector, this._engine = null, this._isSleeping = !0, this._eventOutput = null, this.mass = void 0 !== options.mass ? options.mass : defaults.mass, this.inverseMass = 1 / this.mass, this.setPosition(options.position || defaults.position), this.setVelocity(options.velocity || defaults.velocity), this.force.set(options.force || [0, 0, 0]), this.transform = Transform.identity.slice(), this._spec = {
            size: [!0, !0],
            target: {transform: this.transform, origin: [.5, .5], target: null}
        }
    }

    function _createEventOutput() {
        this._eventOutput = new EventHandler, this._eventOutput.bindThis(this), EventHandler.setOutputHandler(this, this._eventOutput)
    }

    var Vector = require("../../math/Vector"), Transform = require("../../core/Transform"), EventHandler = require("../../core/EventHandler"), Integrator = require("../integrators/SymplecticEuler");
    Particle.DEFAULT_OPTIONS = {position: [0, 0, 0], velocity: [0, 0, 0], mass: 1};
    var _events = {start: "start", update: "update", end: "end"}, now = Date.now;
    Particle.prototype.isBody = !1, Particle.prototype.isActive = function () {
        return !this._isSleeping
    }, Particle.prototype.sleep = function () {
        this._isSleeping || (this.emit(_events.end, this), this._isSleeping = !0)
    }, Particle.prototype.wake = function () {
        this._isSleeping && (this.emit(_events.start, this), this._isSleeping = !1, this._prevTime = now(), this._engine && this._engine.wake())
    }, Particle.prototype.setPosition = function (position) {
        this.position.set(position)
    }, Particle.prototype.setPosition1D = function (x) {
        this.position.x = x
    }, Particle.prototype.getPosition = function () {
        return this._engine.step(), this.position.get()
    }, Particle.prototype.getPosition1D = function () {
        return this._engine.step(), this.position.x
    }, Particle.prototype.setVelocity = function (velocity) {
        this.velocity.set(velocity), (0 !== velocity[0] || 0 !== velocity[1] || 0 !== velocity[2]) && this.wake()
    }, Particle.prototype.setVelocity1D = function (x) {
        this.velocity.x = x, 0 !== x && this.wake()
    }, Particle.prototype.getVelocity = function () {
        return this.velocity.get()
    }, Particle.prototype.setForce = function (force) {
        this.force.set(force), this.wake()
    }, Particle.prototype.getVelocity1D = function () {
        return this.velocity.x
    }, Particle.prototype.setMass = function (mass) {
        this.mass = mass, this.inverseMass = 1 / mass
    }, Particle.prototype.getMass = function () {
        return this.mass
    }, Particle.prototype.reset = function (position, velocity) {
        this.setPosition(position || [0, 0, 0]), this.setVelocity(velocity || [0, 0, 0])
    }, Particle.prototype.applyForce = function (force) {
        force.isZero() || (this.force.add(force).put(this.force), this.wake())
    }, Particle.prototype.applyImpulse = function (impulse) {
        if (!impulse.isZero()) {
            var velocity = this.velocity;
            velocity.add(impulse.mult(this.inverseMass)).put(velocity)
        }
    }, Particle.prototype.integrateVelocity = function (dt) {
        Integrator.integrateVelocity(this, dt)
    }, Particle.prototype.integratePosition = function (dt) {
        Integrator.integratePosition(this, dt)
    }, Particle.prototype._integrate = function (dt) {
        this.integrateVelocity(dt), this.integratePosition(dt)
    }, Particle.prototype.getEnergy = function () {
        return .5 * this.mass * this.velocity.normSquared()
    }, Particle.prototype.getTransform = function () {
        this._engine.step();
        var position = this.position, transform = this.transform;
        return transform[12] = position.x, transform[13] = position.y, transform[14] = position.z, transform
    }, Particle.prototype.modify = function (target) {
        var _spec = this._spec.target;
        return _spec.transform = this.getTransform(), _spec.target = target, this._spec
    }, Particle.prototype.emit = function (type, data) {
        this._eventOutput && this._eventOutput.emit(type, data)
    }, Particle.prototype.on = function () {
        return _createEventOutput.call(this), this.on.apply(this, arguments)
    }, Particle.prototype.removeListener = function () {
        return _createEventOutput.call(this), this.removeListener.apply(this, arguments)
    }, Particle.prototype.pipe = function () {
        return _createEventOutput.call(this), this.pipe.apply(this, arguments)
    }, Particle.prototype.unpipe = function () {
        return _createEventOutput.call(this), this.unpipe.apply(this, arguments)
    }, module.exports = Particle
}), define("famous/physics/forces/Force", ["require", "exports", "module", "../../math/Vector", "../../core/EventHandler"], function (require, exports, module) {
    function Force(force) {
        this.force = new Vector(force), this._eventOutput = new EventHandler, EventHandler.setOutputHandler(this, this._eventOutput)
    }

    var Vector = require("../../math/Vector"), EventHandler = require("../../core/EventHandler");
    Force.prototype.setOptions = function (options) {
        this._eventOutput.emit("change", options)
    }, Force.prototype.applyForce = function (targets) {
        for (var length = targets.length; length--;)targets[length].applyForce(this.force)
    }, Force.prototype.getEnergy = function () {
        return 0
    }, module.exports = Force
}), define("famous/physics/forces/Drag", ["require", "exports", "module", "./Force"], function (require, exports, module) {
    function Drag(options) {
        this.options = Object.create(this.constructor.DEFAULT_OPTIONS), options && this.setOptions(options), Force.call(this)
    }

    var Force = require("./Force");
    Drag.prototype = Object.create(Force.prototype), Drag.prototype.constructor = Drag, Drag.FORCE_FUNCTIONS = {
        LINEAR: function (velocity) {
            return velocity
        }, QUADRATIC: function (velocity) {
            return velocity.mult(velocity.norm())
        }
    }, Drag.DEFAULT_OPTIONS = {
        strength: .01,
        forceFunction: Drag.FORCE_FUNCTIONS.LINEAR
    }, Drag.prototype.applyForce = function (targets) {
        var index, particle, strength = this.options.strength, forceFunction = this.options.forceFunction, force = this.force;
        for (index = 0; index < targets.length; index++)particle = targets[index], forceFunction(particle.velocity).mult(-strength).put(force), particle.applyForce(force)
    }, Drag.prototype.setOptions = function (options) {
        for (var key in options)this.options[key] = options[key]
    }, module.exports = Drag
}), define("famous/physics/forces/Spring", ["require", "exports", "module", "./Force", "../../math/Vector"], function (require, exports, module) {
    function Spring(options) {
        Force.call(this), this.options = Object.create(this.constructor.DEFAULT_OPTIONS), options && this.setOptions(options), this.disp = new Vector(0, 0, 0), _init.call(this)
    }

    function _calcStiffness() {
        var options = this.options;
        options.stiffness = Math.pow(2 * pi / options.period, 2)
    }

    function _calcDamping() {
        var options = this.options;
        options.damping = 4 * pi * options.dampingRatio / options.period
    }

    function _init() {
        _calcStiffness.call(this), _calcDamping.call(this)
    }

    var Force = require("./Force"), Vector = require("../../math/Vector");
    Spring.prototype = Object.create(Force.prototype), Spring.prototype.constructor = Spring;
    var pi = Math.PI, MIN_PERIOD = 150;
    Spring.FORCE_FUNCTIONS = {
        FENE: function (dist, rMax) {
            var rMaxSmall = .99 * rMax, r = Math.max(Math.min(dist, rMaxSmall), -rMaxSmall);
            return r / (1 - r * r / (rMax * rMax))
        }, HOOK: function (dist) {
            return dist
        }
    }, Spring.DEFAULT_OPTIONS = {
        period: 300,
        dampingRatio: .1,
        length: 0,
        maxLength: 1 / 0,
        anchor: void 0,
        forceFunction: Spring.FORCE_FUNCTIONS.HOOK
    }, Spring.prototype.setOptions = function (options) {
        void 0 !== options.anchor && (options.anchor.position instanceof Vector && (this.options.anchor = options.anchor.position), options.anchor instanceof Vector && (this.options.anchor = options.anchor), options.anchor instanceof Array && (this.options.anchor = new Vector(options.anchor))), void 0 !== options.period && (options.period < MIN_PERIOD && (options.period = MIN_PERIOD, console.warn("The period of a SpringTransition is capped at " + MIN_PERIOD + " ms. Use a SnapTransition for faster transitions")), this.options.period = options.period), void 0 !== options.dampingRatio && (this.options.dampingRatio = options.dampingRatio), void 0 !== options.length && (this.options.length = options.length), void 0 !== options.forceFunction && (this.options.forceFunction = options.forceFunction), void 0 !== options.maxLength && (this.options.maxLength = options.maxLength), _init.call(this), Force.prototype.setOptions.call(this, options)
    }, Spring.prototype.applyForce = function (targets, source) {
        var i, target, p2, v2, dist, m, force = this.force, disp = this.disp, options = this.options, stiffness = options.stiffness, damping = options.damping, restLength = options.length, maxLength = options.maxLength, anchor = options.anchor || source.position, forceFunction = options.forceFunction;
        for (i = 0; i < targets.length; i++) {
            if (target = targets[i], p2 = target.position, v2 = target.velocity, anchor.sub(p2).put(disp), dist = disp.norm() - restLength, 0 === dist)return;
            m = target.mass, stiffness *= m, damping *= m, disp.normalize(stiffness * forceFunction(dist, maxLength)).put(force), damping && (source ? force.add(v2.sub(source.velocity).mult(-damping)).put(force) : force.add(v2.mult(-damping)).put(force)), target.applyForce(force), source && source.applyForce(force.mult(-1))
        }
    }, Spring.prototype.getEnergy = function (targets, source) {
        for (var options = this.options, restLength = options.length, anchor = source ? source.position : options.anchor, strength = options.stiffness, energy = 0, i = 0; i < targets.length; i++) {
            var target = targets[i], dist = anchor.sub(target.position).norm() - restLength;
            energy += .5 * strength * dist * dist
        }
        return energy
    }, module.exports = Spring
}), define("famous/core/ViewSequence", ["require", "exports", "module"], function (require, exports, module) {
    function ViewSequence(options) {
        options || (options = []), options instanceof Array && (options = {array: options}), this._ = null, this.index = options.index || 0, options.array ? this._ = new this.constructor.Backing(options.array) : options._ && (this._ = options._), this.index === this._.firstIndex && (this._.firstNode = this), this.index === this._.firstIndex + this._.array.length - 1 && (this._.lastNode = this), void 0 !== options.loop && (this._.loop = options.loop), void 0 !== options.trackSize && (this._.trackSize = options.trackSize), this._previousNode = null, this._nextNode = null
    }

    ViewSequence.Backing = function (array) {
        this.array = array, this.firstIndex = 0, this.loop = !1, this.firstNode = null, this.lastNode = null, this.cumulativeSizes = [[0, 0]], this.sizeDirty = !0, this.trackSize = !1
    }, ViewSequence.Backing.prototype.getValue = function (i) {
        var _i = i - this.firstIndex;
        return 0 > _i || _i >= this.array.length ? null : this.array[_i]
    }, ViewSequence.Backing.prototype.setValue = function (i, value) {
        this.array[i - this.firstIndex] = value
    }, ViewSequence.Backing.prototype.getSize = function (index) {
        return this.cumulativeSizes[index]
    }, ViewSequence.Backing.prototype.calculateSize = function (index) {
        index = index || this.array.length;
        for (var size = [0, 0], i = 0; index > i; i++) {
            var nodeSize = this.array[i].getSize();
            if (!nodeSize)return void 0;
            void 0 !== size[0] && (void 0 === nodeSize[0] ? size[0] = void 0 : size[0] += nodeSize[0]), void 0 !== size[1] && (void 0 === nodeSize[1] ? size[1] = void 0 : size[1] += nodeSize[1]), this.cumulativeSizes[i + 1] = size.slice()
        }
        return this.sizeDirty = !1, size
    }, ViewSequence.Backing.prototype.reindex = function (start, removeCount, insertCount) {
        if (this.array[0]) {
            for (var i = 0, index = this.firstIndex, indexShiftAmount = insertCount - removeCount, node = this.firstNode; start - 1 > index;)node = node.getNext(), index++;
            var spliceStartNode = node;
            for (i = 0; removeCount > i; i++)node = node.getNext(), node && (node._previousNode = spliceStartNode);
            var spliceResumeNode = node ? node.getNext() : null;
            for (spliceStartNode._nextNode = null, node = spliceStartNode, i = 0; insertCount > i; i++)node = node.getNext();
            if (index += insertCount, node !== spliceResumeNode && (node._nextNode = spliceResumeNode, spliceResumeNode && (spliceResumeNode._previousNode = node)), spliceResumeNode)for (node = spliceResumeNode, index++; node && index < this.array.length + this.firstIndex;)node._nextNode ? node.index += indexShiftAmount : node.index = index, node = node.getNext(), index++;
            this.trackSize && (this.sizeDirty = !0)
        }
    }, ViewSequence.prototype.getPrevious = function () {
        var len = this._.array.length;
        return len ? this.index === this._.firstIndex ? this._.loop ? (this._previousNode = this._.lastNode || new this.constructor({
            _: this._,
            index: this._.firstIndex + len - 1
        }), this._previousNode._nextNode = this) : this._previousNode = null : this._previousNode || (this._previousNode = new this.constructor({
            _: this._,
            index: this.index - 1
        }), this._previousNode._nextNode = this) : this._previousNode = null, this._previousNode
    }, ViewSequence.prototype.getNext = function () {
        var len = this._.array.length;
        return len ? this.index === this._.firstIndex + len - 1 ? this._.loop ? (this._nextNode = this._.firstNode || new this.constructor({
            _: this._,
            index: this._.firstIndex
        }), this._nextNode._previousNode = this) : this._nextNode = null : this._nextNode || (this._nextNode = new this.constructor({
            _: this._,
            index: this.index + 1
        }), this._nextNode._previousNode = this) : this._nextNode = null, this._nextNode
    }, ViewSequence.prototype.indexOf = function (item) {
        return this._.array.indexOf(item)
    }, ViewSequence.prototype.getIndex = function () {
        return this.index
    }, ViewSequence.prototype.toString = function () {
        return "" + this.index
    }, ViewSequence.prototype.unshift = function () {
        this._.array.unshift.apply(this._.array, arguments), this._.firstIndex -= arguments.length, this._.trackSize && (this._.sizeDirty = !0)
    }, ViewSequence.prototype.push = function () {
        this._.array.push.apply(this._.array, arguments), this._.trackSize && (this._.sizeDirty = !0)
    }, ViewSequence.prototype.splice = function (index, howMany) {
        var values = Array.prototype.slice.call(arguments, 2);
        this._.array.splice.apply(this._.array, [index - this._.firstIndex, howMany].concat(values)), this._.reindex(index, howMany, values.length)
    }, ViewSequence.prototype.swap = function (other) {
        var otherValue = other.get(), myValue = this.get();
        this._.setValue(this.index, otherValue), this._.setValue(other.index, myValue);
        var myPrevious = this._previousNode, myNext = this._nextNode, myIndex = this.index, otherPrevious = other._previousNode, otherNext = other._nextNode, otherIndex = other.index;
        this.index = otherIndex, this._previousNode = otherPrevious === this ? other : otherPrevious, this._previousNode && (this._previousNode._nextNode = this), this._nextNode = otherNext === this ? other : otherNext, this._nextNode && (this._nextNode._previousNode = this), other.index = myIndex, other._previousNode = myPrevious === other ? this : myPrevious, other._previousNode && (other._previousNode._nextNode = other), other._nextNode = myNext === other ? this : myNext, other._nextNode && (other._nextNode._previousNode = other), this.index === this._.firstIndex ? this._.firstNode = this : this.index === this._.firstIndex + this._.array.length - 1 && (this._.lastNode = this), other.index === this._.firstIndex ? this._.firstNode = other : other.index === this._.firstIndex + this._.array.length - 1 && (this._.lastNode = other), this._.trackSize && (this._.sizeDirty = !0)
    }, ViewSequence.prototype.get = function () {
        return this._.getValue(this.index)
    }, ViewSequence.prototype.getSize = function () {
        var target = this.get();
        return target ? target.getSize() : null
    }, ViewSequence.prototype.render = function () {
        this._.trackSize && this._.sizeDirty && this._.calculateSize();
        var target = this.get();
        return target ? target.render.apply(target, arguments) : null
    }, module.exports = ViewSequence
}), define("famous/core/Group", ["require", "exports", "module", "./Context", "./Transform", "./Surface"], function (require, exports, module) {
    function Group(options) {
        Surface.call(this, options), this._shouldRecalculateSize = !1, this._container = document.createDocumentFragment(), this.context = new Context(this._container), this.setContent(this._container), this._groupSize = [void 0, void 0]
    }

    var Context = require("./Context"), Transform = require("./Transform"), Surface = require("./Surface");
    Group.SIZE_ZERO = [0, 0], Group.prototype = Object.create(Surface.prototype), Group.prototype.elementType = "div", Group.prototype.elementClass = "famous-group", Group.prototype.add = function () {
        return this.context.add.apply(this.context, arguments)
    }, Group.prototype.render = function () {
        return Surface.prototype.render.call(this)
    }, Group.prototype.deploy = function (target) {
        this.context.migrate(target)
    }, Group.prototype.recall = function () {
        this._container = document.createDocumentFragment(), this.context.migrate(this._container)
    }, Group.prototype.commit = function (context) {
        var transform = context.transform, origin = context.origin, opacity = context.opacity, size = context.size, result = Surface.prototype.commit.call(this, {
            allocator: context.allocator,
            transform: Transform.thenMove(transform, [-origin[0] * size[0], -origin[1] * size[1], 0]),
            opacity: opacity,
            origin: origin,
            size: Group.SIZE_ZERO
        });
        return (size[0] !== this._groupSize[0] || size[1] !== this._groupSize[1]) && (this._groupSize[0] = size[0], this._groupSize[1] = size[1], this.context.setSize(size)), this.context.update({
            transform: Transform.translate(-origin[0] * size[0], -origin[1] * size[1], 0),
            origin: origin,
            size: size
        }), result
    }, module.exports = Group
}), define("famous/views/Scroller", ["require", "exports", "module", "../core/Entity", "../core/Group", "../core/OptionsManager", "../core/Transform", "../utilities/Utility", "../core/ViewSequence", "../core/EventHandler"], function (require, exports, module) {
    function Scroller(options) {
        this.options = Object.create(this.constructor.DEFAULT_OPTIONS), this._optionsManager = new OptionsManager(this.options), options && this._optionsManager.setOptions(options), this._node = null, this._position = 0, this._positionOffset = 0, this._positionGetter = null, this._outputFunction = null, this._masterOutputFunction = null, this.outputFrom(), this._onEdge = 0, this.group = new Group, this.group.add({render: _innerRender.bind(this)}), this._entityId = Entity.register(this), this._size = [void 0, void 0], this._contextSize = [void 0, void 0], this._eventInput = new EventHandler, this._eventOutput = new EventHandler, EventHandler.setInputHandler(this, this._eventInput), EventHandler.setOutputHandler(this, this._eventOutput)
    }

    function _sizeForDir(size) {
        size || (size = this._contextSize);
        var dimension = this.options.direction;
        return void 0 === size[dimension] ? this._contextSize[dimension] : size[dimension]
    }

    function _output(node, offset, target) {
        var size = node.getSize ? node.getSize() : this._contextSize, transform = this._outputFunction(offset);
        return target.push({transform: transform, target: node.render()}), _sizeForDir.call(this, size)
    }

    function _getClipSize() {
        return void 0 !== this.options.clipSize ? this.options.clipSize : this._contextSize[this.options.direction] > this.getCumulativeSize()[this.options.direction] ? _sizeForDir.call(this, this.getCumulativeSize()) : _sizeForDir.call(this, this._contextSize)
    }

    function _innerRender() {
        for (var size = null, position = this._position, result = [], offset = -this._positionOffset, clipSize = _getClipSize.call(this), currNode = this._node; currNode && offset - position < clipSize + this.options.margin;)offset += _output.call(this, currNode, offset, result), currNode = currNode.getNext ? currNode.getNext() : null;
        var sizeNode = this._node, nodesSize = _sizeForDir.call(this, sizeNode.getSize());
        if (clipSize > offset) {
            for (; sizeNode && clipSize > nodesSize;)sizeNode = sizeNode.getPrevious(), sizeNode && (nodesSize += _sizeForDir.call(this, sizeNode.getSize()));
            for (sizeNode = this._node; sizeNode && clipSize > nodesSize;)sizeNode = sizeNode.getNext(), sizeNode && (nodesSize += _sizeForDir.call(this, sizeNode.getSize()))
        }
        for (!currNode && clipSize - EDGE_TOLERANCE > offset - position ? 1 !== this._onEdge && (this._onEdge = 1, this._eventOutput.emit("onEdge", {position: offset - clipSize})) : !this._node.getPrevious() && -EDGE_TOLERANCE > position ? -1 !== this._onEdge && (this._onEdge = -1, this._eventOutput.emit("onEdge", {position: 0})) : 0 !== this._onEdge && (this._onEdge = 0, this._eventOutput.emit("offEdge")), currNode = this._node && this._node.getPrevious ? this._node.getPrevious() : null, offset = -this._positionOffset, currNode && (size = currNode.getSize ? currNode.getSize() : this._contextSize, offset -= _sizeForDir.call(this, size)); currNode && offset - position > -(clipSize + this.options.margin);)_output.call(this, currNode, offset, result), currNode = currNode.getPrevious ? currNode.getPrevious() : null, currNode && (size = currNode.getSize ? currNode.getSize() : this._contextSize, offset -= _sizeForDir.call(this, size));
        return result
    }

    var Entity = require("../core/Entity"), Group = require("../core/Group"), OptionsManager = require("../core/OptionsManager"), Transform = require("../core/Transform"), Utility = require("../utilities/Utility"), ViewSequence = require("../core/ViewSequence"), EventHandler = require("../core/EventHandler");
    Scroller.DEFAULT_OPTIONS = {direction: Utility.Direction.Y, margin: 0, clipSize: void 0, groupScroll: !1};
    var EDGE_TOLERANCE = 0;
    Scroller.prototype.getCumulativeSize = function (index) {
        return void 0 === index && (index = this._node._.cumulativeSizes.length - 1), this._node._.getSize(index)
    }, Scroller.prototype.setOptions = function (options) {
        options.groupScroll !== this.options.groupScroll && (options.groupScroll ? this.group.pipe(this._eventOutput) : this.group.unpipe(this._eventOutput)), this._optionsManager.setOptions(options)
    }, Scroller.prototype.onEdge = function () {
        return this._onEdge
    }, Scroller.prototype.outputFrom = function (fn, masterFn) {
        fn || (fn = function (offset) {
            return this.options.direction === Utility.Direction.X ? Transform.translate(offset, 0) : Transform.translate(0, offset)
        }.bind(this), masterFn || (masterFn = fn)), this._outputFunction = fn, this._masterOutputFunction = masterFn ? masterFn : function (offset) {
            return Transform.inverse(fn(-offset))
        }
    }, Scroller.prototype.positionFrom = function (position) {
        position instanceof Function ? this._positionGetter = position : position && position.get ? this._positionGetter = position.get.bind(position) : (this._positionGetter = null, this._position = position), this._positionGetter && (this._position = this._positionGetter.call(this))
    }, Scroller.prototype.sequenceFrom = function (node) {
        node instanceof Array && (node = new ViewSequence({array: node})), this._node = node, this._positionOffset = 0
    }, Scroller.prototype.getSize = function (actual) {
        return actual ? this._contextSize : this._size
    }, Scroller.prototype.render = function () {
        return this._node ? (this._positionGetter && (this._position = this._positionGetter.call(this)), this._entityId) : null
    }, Scroller.prototype.commit = function (context) {
        var transform = context.transform, opacity = context.opacity, origin = context.origin, size = context.size;
        this.options.clipSize || size[0] === this._contextSize[0] && size[1] === this._contextSize[1] || (this._onEdge = 0, this._contextSize[0] = size[0], this._contextSize[1] = size[1], this.options.direction === Utility.Direction.X ? (this._size[0] = _getClipSize.call(this), this._size[1] = void 0) : (this._size[0] = void 0, this._size[1] = _getClipSize.call(this)));
        var scrollTransform = this._masterOutputFunction(-this._position);
        return {
            transform: Transform.multiply(transform, scrollTransform),
            size: size,
            opacity: opacity,
            origin: origin,
            target: this.group.render()
        }
    }, module.exports = Scroller
}), define("famous/inputs/ScrollSync", ["require", "exports", "module", "../core/EventHandler", "../core/Engine", "../core/OptionsManager"], function (require, exports, module) {
    function ScrollSync(options) {
        this.options = Object.create(ScrollSync.DEFAULT_OPTIONS), this._optionsManager = new OptionsManager(this.options), options && this.setOptions(options), this._payload = {
            delta: null,
            position: null,
            velocity: null,
            slip: !0
        }, this._eventInput = new EventHandler, this._eventOutput = new EventHandler, EventHandler.setInputHandler(this, this._eventInput), EventHandler.setOutputHandler(this, this._eventOutput), this._position = void 0 === this.options.direction ? [0, 0] : 0, this._prevTime = void 0, this._prevVel = void 0, this._eventInput.on("mousewheel", _handleMove.bind(this)), this._eventInput.on("wheel", _handleMove.bind(this)), this._inProgress = !1, this._loopBound = !1
    }

    function _newFrame() {
        if (this._inProgress && _now() - this._prevTime > this.options.stallTime) {
            this._inProgress = !1;
            var finalVel = Math.abs(this._prevVel) >= this.options.minimumEndSpeed ? this._prevVel : 0, payload = this._payload;
            payload.position = this._position, payload.velocity = finalVel, payload.slip = !0, this._eventOutput.emit("end", payload)
        }
    }

    function _handleMove(event) {
        this.options.preventDefault && event.preventDefault(), this._inProgress || (this._inProgress = !0, this._position = void 0 === this.options.direction ? [0, 0] : 0, payload = this._payload, payload.slip = !0, payload.position = this._position, payload.clientX = event.clientX, payload.clientY = event.clientY, payload.offsetX = event.offsetX, payload.offsetY = event.offsetY, this._eventOutput.emit("start", payload), this._loopBound || (Engine.on("prerender", _newFrame.bind(this)), this._loopBound = !0));
        var currTime = _now(), prevTime = this._prevTime || currTime, diffX = void 0 !== event.wheelDeltaX ? event.wheelDeltaX : -event.deltaX, diffY = void 0 !== event.wheelDeltaY ? event.wheelDeltaY : -event.deltaY;
        1 === event.deltaMode && (diffX *= this.options.lineHeight, diffY *= this.options.lineHeight), this.options.rails && (Math.abs(diffX) > Math.abs(diffY) ? diffY = 0 : diffX = 0);
        var nextVel, nextDelta, diffTime = Math.max(currTime - prevTime, MINIMUM_TICK_TIME), velX = diffX / diffTime, velY = diffY / diffTime, scale = this.options.scale;
        this.options.direction === ScrollSync.DIRECTION_X ? (nextDelta = scale * diffX, nextVel = scale * velX, this._position += nextDelta) : this.options.direction === ScrollSync.DIRECTION_Y ? (nextDelta = scale * diffY, nextVel = scale * velY, this._position += nextDelta) : (nextDelta = [scale * diffX, scale * diffY], nextVel = [scale * velX, scale * velY], this._position[0] += nextDelta[0], this._position[1] += nextDelta[1]);
        var payload = this._payload;
        payload.delta = nextDelta, payload.velocity = nextVel, payload.position = this._position, payload.slip = !0, this._eventOutput.emit("update", payload), this._prevTime = currTime, this._prevVel = nextVel
    }

    var EventHandler = require("../core/EventHandler"), Engine = require("../core/Engine"), OptionsManager = require("../core/OptionsManager");
    ScrollSync.DEFAULT_OPTIONS = {
        direction: void 0,
        minimumEndSpeed: 1 / 0,
        rails: !1,
        scale: 1,
        stallTime: 50,
        lineHeight: 40,
        preventDefault: !0
    }, ScrollSync.DIRECTION_X = 0, ScrollSync.DIRECTION_Y = 1;
    var MINIMUM_TICK_TIME = 8, _now = Date.now;
    ScrollSync.prototype.getOptions = function () {
        return this.options
    }, ScrollSync.prototype.setOptions = function (options) {
        return this._optionsManager.setOptions(options)
    }, module.exports = ScrollSync
}), define("famous/inputs/TouchTracker", ["require", "exports", "module", "../core/EventHandler"], function (require, exports, module) {
    function _timestampTouch(touch, event, history) {
        return {
            x: touch.clientX,
            y: touch.clientY,
            identifier: touch.identifier,
            origin: event.origin,
            timestamp: _now(),
            count: event.touches.length,
            history: history
        }
    }

    function _handleStart(event) {
        if (!(event.touches.length > this.touchLimit)) {
            this.isTouched = !0;
            for (var i = 0; i < event.changedTouches.length; i++) {
                var touch = event.changedTouches[i], data = _timestampTouch(touch, event, null);
                this.eventOutput.emit("trackstart", data), this.selective || this.touchHistory[touch.identifier] || this.track(data)
            }
        }
    }

    function _handleMove(event) {
        if (!(event.touches.length > this.touchLimit))for (var i = 0; i < event.changedTouches.length; i++) {
            var touch = event.changedTouches[i], history = this.touchHistory[touch.identifier];
            if (history) {
                var data = _timestampTouch(touch, event, history);
                this.touchHistory[touch.identifier].push(data), this.eventOutput.emit("trackmove", data)
            }
        }
    }

    function _handleEnd(event) {
        if (this.isTouched) {
            for (var i = 0; i < event.changedTouches.length; i++) {
                var touch = event.changedTouches[i], history = this.touchHistory[touch.identifier];
                if (history) {
                    var data = _timestampTouch(touch, event, history);
                    this.touchHistory[touch.identifier].push(data), this.eventOutput.emit("trackend", data), delete this.touchHistory[touch.identifier]
                }
            }
            this.isTouched = !1
        }
    }

    function _handleUnpipe() {
        for (var i in this.touchHistory) {
            var history = this.touchHistory[i];
            this.eventOutput.emit("trackend", {
                touch: history[history.length - 1].touch,
                timestamp: Date.now(),
                count: 0,
                history: history
            }), delete this.touchHistory[i]
        }
    }

    function TouchTracker(options) {
        this.selective = options.selective, this.touchLimit = options.touchLimit || 1, this.touchHistory = {}, this.eventInput = new EventHandler, this.eventOutput = new EventHandler, EventHandler.setInputHandler(this, this.eventInput), EventHandler.setOutputHandler(this, this.eventOutput), this.eventInput.on("touchstart", _handleStart.bind(this)), this.eventInput.on("touchmove", _handleMove.bind(this)), this.eventInput.on("touchend", _handleEnd.bind(this)), this.eventInput.on("touchcancel", _handleEnd.bind(this)), this.eventInput.on("unpipe", _handleUnpipe.bind(this)), this.isTouched = !1
    }

    var EventHandler = require("../core/EventHandler"), _now = Date.now;
    TouchTracker.prototype.track = function (data) {
        this.touchHistory[data.identifier] = [data]
    }, module.exports = TouchTracker
}), define("famous/inputs/TouchSync", ["require", "exports", "module", "./TouchTracker", "../core/EventHandler", "../core/OptionsManager", "./SyncUtils"], function (require, exports, module) {
    function TouchSync(options) {
        this.options = Object.create(TouchSync.DEFAULT_OPTIONS), this._optionsManager = new OptionsManager(this.options), options && this.setOptions(options), this._eventOutput = new EventHandler, this._touchTracker = new TouchTracker({touchLimit: this.options.touchLimit}), EventHandler.setOutputHandler(this, this._eventOutput), EventHandler.setInputHandler(this, this._touchTracker), this._touchTracker.on("trackstart", _handleStart.bind(this)), this._touchTracker.on("trackmove", _handleMove.bind(this)), this._touchTracker.on("trackend", _handleEnd.bind(this)), this._payload = {
            delta: null,
            position: null,
            velocity: null,
            clientX: void 0,
            clientY: void 0,
            count: 0,
            touch: void 0
        }, this._position = null
    }

    function _handleStart(data) {
        var velocity, delta;
        void 0 !== this.options.direction ? (this._position = 0, velocity = 0, delta = 0) : (this._position = [0, 0], velocity = [0, 0], delta = [0, 0]);
        var payload = this._payload;
        payload.delta = delta, payload.position = this._position, payload.velocity = velocity, payload.clientX = data.x, payload.clientY = data.y, payload.count = data.count, payload.touch = data.identifier, this._eventOutput.emit("start", payload)
    }

    function _handleMove(data) {
        calculatePayload.call(this, data)
    }

    function calculatePayload(data) {
        var history = data.history, currHistory = history[history.length - 1], distantHistory = SyncUtils.getTimeHistoryPosition(history, this.options.timeSampleDuration), distantTime = distantHistory.timestamp, currTime = currHistory.timestamp, diffX = currHistory.x - distantHistory.x, diffY = currHistory.y - distantHistory.y, velDiffX = currHistory.x - distantTime, velDiffY = currHistory.y - distantTime;
        this.options.rails && (Math.abs(diffX) > Math.abs(diffY) ? diffY = 0 : diffX = 0, Math.abs(velDiffX) > Math.abs(velDiffY) ? velDiffY = 0 : velDiffX = 0);
        var nextVel, nextDelta, diffTime = Math.max(currTime - distantTime, MINIMUM_TICK_TIME), velX = velDiffX / diffTime, velY = velDiffY / diffTime, scale = this.options.scale;
        this.options.direction === TouchSync.DIRECTION_X ? (nextDelta = scale * diffX, nextVel = scale * velX, this._position += nextDelta) : this.options.direction === TouchSync.DIRECTION_Y ? (nextDelta = scale * diffY, nextVel = scale * velY, this._position += nextDelta) : (nextDelta = [scale * diffX, scale * diffY], nextVel = [scale * velX, scale * velY], this._position[0] += nextDelta[0], this._position[1] += nextDelta[1]);
        var payload = this._payload;
        payload.delta = nextDelta, payload.velocity = nextVel, payload.position = this._position, payload.clientX = data.x, payload.clientY = data.y, payload.count = data.count, payload.touch = data.identifier, this._eventOutput.emit("update", payload)
    }

    function _handleEnd(data) {
        calculatePayload.call(this, data), this._payload.count = data.count, this._eventOutput.emit("end", this._payload)
    }

    var TouchTracker = require("./TouchTracker"), EventHandler = require("../core/EventHandler"), OptionsManager = require("../core/OptionsManager"), SyncUtils = require("./SyncUtils");
    TouchSync.DEFAULT_OPTIONS = {
        direction: void 0,
        rails: !1,
        touchLimit: 1,
        velocitySampleLength: 10,
        scale: 1,
        timeSampleDuration: 400
    }, TouchSync.DIRECTION_X = 0, TouchSync.DIRECTION_Y = 1;
    var MINIMUM_TICK_TIME = 8;
    TouchSync.prototype.setOptions = function (options) {
        return this._optionsManager.setOptions(options)
    }, TouchSync.prototype.getOptions = function () {
        return this.options
    }, module.exports = TouchSync
}), define("famous/views/Scrollview", ["require", "exports", "module", "../physics/PhysicsEngine", "../physics/bodies/Particle", "../physics/forces/Drag", "../physics/forces/Spring", "../core/EventHandler", "../core/OptionsManager", "../core/ViewSequence", "../views/Scroller", "../utilities/Utility", "../inputs/GenericSync", "../inputs/ScrollSync", "../inputs/TouchSync"], function (require, exports, module) {
    function Scrollview(options) {
        this.options = Object.create(Scrollview.DEFAULT_OPTIONS), this._optionsManager = new OptionsManager(this.options), this._scroller = new Scroller(this.options), this.sync = new GenericSync(["scroll", "touch"], {
            direction: this.options.direction,
            scale: this.options.syncScale,
            rails: this.options.rails,
            preventDefault: void 0 !== this.options.preventDefault ? this.options.preventDefault : this.options.direction !== Utility.Direction.Y
        }), this._physicsEngine = new PhysicsEngine, this._particle = new Particle, this._physicsEngine.addBody(this._particle), this.spring = new Spring({
            anchor: [0, 0, 0],
            period: this.options.edgePeriod,
            dampingRatio: this.options.edgeDamp
        }), this.drag = new Drag({
            forceFunction: Drag.FORCE_FUNCTIONS.QUADRATIC,
            strength: this.options.drag
        }), this.friction = new Drag({
            forceFunction: Drag.FORCE_FUNCTIONS.LINEAR,
            strength: this.options.friction
        }), this._node = null, this._touchCount = 0, this._springState = SpringStates.NONE, this._onEdge = EdgeStates.NONE, this._pageSpringPosition = 0, this._edgeSpringPosition = 0, this._touchVelocity = 0, this._earlyEnd = !1, this._needsPaginationCheck = !1, this._displacement = 0, this._totalShift = 0, this._cachedIndex = 0, this._scroller.positionFrom(this.getPosition.bind(this)), this._eventInput = new EventHandler, this._eventOutput = new EventHandler, this._eventInput.pipe(this.sync), this.sync.pipe(this._eventInput), EventHandler.setInputHandler(this, this._eventInput), EventHandler.setOutputHandler(this, this._eventOutput), _bindEvents.call(this), options && this.setOptions(options)
    }

    function _handleStart(event) {
        this._touchCount = event.count, void 0 === event.count && (this._touchCount = 1), _detachAgents.call(this), this.setVelocity(0), this._touchVelocity = 0, this._earlyEnd = !1
    }

    function _handleMove(event) {
        var velocity = -event.velocity, delta = -event.delta;
        if (this._onEdge !== EdgeStates.NONE && event.slip && (0 > velocity && this._onEdge === EdgeStates.TOP || velocity > 0 && this._onEdge === EdgeStates.BOTTOM ? this._earlyEnd || (_handleEnd.call(this, event), this._earlyEnd = !0) : this._earlyEnd && Math.abs(velocity) > Math.abs(this.getVelocity()) && _handleStart.call(this, event)), !this._earlyEnd) {
            if (this._touchVelocity = velocity, event.slip) {
                var speedLimit = this.options.speedLimit;
                -speedLimit > velocity ? velocity = -speedLimit : velocity > speedLimit && (velocity = speedLimit), this.setVelocity(velocity);
                var deltaLimit = 16 * speedLimit;
                delta > deltaLimit ? delta = deltaLimit : -deltaLimit > delta && (delta = -deltaLimit)
            }
            this.setPosition(this.getPosition() + delta), this._displacement += delta, this._springState === SpringStates.NONE && _normalizeState.call(this)
        }
    }

    function _handleEnd(event) {
        if (this._touchCount = event.count || 0, !this._touchCount) {
            _detachAgents.call(this), this._onEdge !== EdgeStates.NONE && _setSpring.call(this, this._edgeSpringPosition, SpringStates.EDGE), _attachAgents.call(this);
            var velocity = -event.velocity, speedLimit = this.options.speedLimit;
            event.slip && (speedLimit *= this.options.edgeGrip), -speedLimit > velocity ? velocity = -speedLimit : velocity > speedLimit && (velocity = speedLimit), this.setVelocity(velocity), this._touchVelocity = 0, this._needsPaginationCheck = !0
        }
    }

    function _bindEvents() {
        this._eventInput.bindThis(this), this._eventInput.on("start", _handleStart), this._eventInput.on("update", _handleMove), this._eventInput.on("end", _handleEnd), this._eventInput.on("resize", function () {
            this._node._.calculateSize()
        }.bind(this)), this._scroller.on("onEdge", function (data) {
            this._edgeSpringPosition = data.position, _handleEdge.call(this, this._scroller.onEdge()), this._eventOutput.emit("onEdge")
        }.bind(this)), this._scroller.on("offEdge", function () {
            this.sync.setOptions({scale: this.options.syncScale}), this._onEdge = this._scroller.onEdge(), this._eventOutput.emit("offEdge")
        }.bind(this)), this._particle.on("update", function (particle) {
            this._springState === SpringStates.NONE && _normalizeState.call(this), this._displacement = particle.position.x - this._totalShift
        }.bind(this)), this._particle.on("end", function () {
            (!this.options.paginated || this.options.paginated && this._springState !== SpringStates.NONE) && this._eventOutput.emit("settle")
        }.bind(this))
    }

    function _attachAgents() {
        this._springState ? this._physicsEngine.attach([this.spring], this._particle) : this._physicsEngine.attach([this.drag, this.friction], this._particle)
    }

    function _detachAgents() {
        this._springState = SpringStates.NONE, this._physicsEngine.detachAll()
    }

    function _nodeSizeForDirection(node) {
        var direction = this.options.direction, nodeSize = node.getSize();
        return nodeSize ? nodeSize[direction] : this._scroller.getSize()[direction]
    }

    function _handleEdge(edge) {
        this.sync.setOptions({scale: this.options.edgeGrip}), this._onEdge = edge, this._touchCount || this._springState === SpringStates.EDGE || _setSpring.call(this, this._edgeSpringPosition, SpringStates.EDGE), this._springState && Math.abs(this.getVelocity()) < .001 && (_detachAgents.call(this), _attachAgents.call(this))
    }

    function _handlePagination() {
        if (!this._touchCount && this._springState !== SpringStates.EDGE) {
            var velocity = this.getVelocity();
            if (!(Math.abs(velocity) >= this.options.pageStopSpeed)) {
                var position = this.getPosition(), velocitySwitch = Math.abs(velocity) > this.options.pageSwitchSpeed, nodeSize = _nodeSizeForDirection.call(this, this._node), positionNext = position > .5 * nodeSize, velocityNext = velocity > 0, velocityPrev = 0 > velocity;
                this._needsPaginationCheck = !1, positionNext && !velocitySwitch || velocitySwitch && velocityNext ? this.goToNextPage() : velocitySwitch && velocityPrev ? this.goToPreviousPage() : _setSpring.call(this, 0, SpringStates.PAGE)
            }
        }
    }

    function _setSpring(position, springState) {
        var springOptions;
        springState === SpringStates.EDGE ? (this._edgeSpringPosition = position, springOptions = {
            anchor: [this._edgeSpringPosition, 0, 0],
            period: this.options.edgePeriod,
            dampingRatio: this.options.edgeDamp
        }) : springState === SpringStates.PAGE && (this._pageSpringPosition = position, springOptions = {
            anchor: [this._pageSpringPosition, 0, 0],
            period: this.options.pagePeriod,
            dampingRatio: this.options.pageDamp
        }), this.spring.setOptions(springOptions), springState && !this._springState && (_detachAgents.call(this), this._springState = springState, _attachAgents.call(this)), this._springState = springState
    }

    function _normalizeState() {
        var offset = 0, position = this.getPosition();
        position += (0 > position ? -.5 : .5) >> 0;
        for (var nodeSize = _nodeSizeForDirection.call(this, this._node), nextNode = this._node.getNext(); offset + position >= nodeSize && nextNode;)offset -= nodeSize, this._scroller.sequenceFrom(nextNode), this._node = nextNode, nextNode = this._node.getNext(), nodeSize = _nodeSizeForDirection.call(this, this._node);
        for (var previousNodeSize, previousNode = this._node.getPrevious(); 0 >= offset + position && previousNode;)previousNodeSize = _nodeSizeForDirection.call(this, previousNode), this._scroller.sequenceFrom(previousNode), this._node = previousNode, offset += previousNodeSize, previousNode = this._node.getPrevious();
        offset && _shiftOrigin.call(this, offset), this._node && (this._node.index !== this._cachedIndex ? this.getPosition() < .5 * nodeSize && (this._cachedIndex = this._node.index, this._eventOutput.emit("pageChange", {
            direction: -1,
            index: this._cachedIndex
        })) : this.getPosition() > .5 * nodeSize && (this._cachedIndex = this._node.index + 1, this._eventOutput.emit("pageChange", {
            direction: 1,
            index: this._cachedIndex
        })))
    }

    function _shiftOrigin(amount) {
        this._edgeSpringPosition += amount, this._pageSpringPosition += amount, this.setPosition(this.getPosition() + amount), this._totalShift += amount, this._springState === SpringStates.EDGE ? this.spring.setOptions({anchor: [this._edgeSpringPosition, 0, 0]}) : this._springState === SpringStates.PAGE && this.spring.setOptions({anchor: [this._pageSpringPosition, 0, 0]})
    }

    var PhysicsEngine = require("../physics/PhysicsEngine"), Particle = require("../physics/bodies/Particle"), Drag = require("../physics/forces/Drag"), Spring = require("../physics/forces/Spring"), EventHandler = require("../core/EventHandler"), OptionsManager = require("../core/OptionsManager"), ViewSequence = require("../core/ViewSequence"), Scroller = require("../views/Scroller"), Utility = require("../utilities/Utility"), GenericSync = require("../inputs/GenericSync"), ScrollSync = require("../inputs/ScrollSync"), TouchSync = require("../inputs/TouchSync");
    GenericSync.register({scroll: ScrollSync, touch: TouchSync});
    var SpringStates = {NONE: 0, EDGE: 1, PAGE: 2}, EdgeStates = {TOP: -1, NONE: 0, BOTTOM: 1};
    Scrollview.DEFAULT_OPTIONS = {
        direction: Utility.Direction.Y,
        rails: !0,
        friction: .005,
        drag: 1e-4,
        edgeGrip: .2,
        edgePeriod: 300,
        edgeDamp: 1,
        margin: 1e3,
        paginated: !1,
        pagePeriod: 500,
        pageDamp: .8,
        pageStopSpeed: 10,
        pageSwitchSpeed: .5,
        speedLimit: 5,
        groupScroll: !1,
        syncScale: 1
    }, Scrollview.prototype.getCurrentIndex = function () {
        return this._node.index
    }, Scrollview.prototype.goToPreviousPage = function () {
        if (!this._node || this._onEdge === EdgeStates.TOP)return null;
        if (this.getPosition() > 1 && this._springState === SpringStates.NONE)return _setSpring.call(this, 0, SpringStates.PAGE), this._node;
        var previousNode = this._node.getPrevious();
        if (previousNode) {
            var previousNodeSize = _nodeSizeForDirection.call(this, previousNode);
            this._scroller.sequenceFrom(previousNode), this._node = previousNode, _shiftOrigin.call(this, previousNodeSize), _setSpring.call(this, 0, SpringStates.PAGE)
        }
        return previousNode
    }, Scrollview.prototype.goToNextPage = function () {
        if (!this._node || this._onEdge === EdgeStates.BOTTOM)return null;
        var nextNode = this._node.getNext();
        if (nextNode) {
            var currentNodeSize = _nodeSizeForDirection.call(this, this._node);
            this._scroller.sequenceFrom(nextNode), this._node = nextNode, _shiftOrigin.call(this, -currentNodeSize), _setSpring.call(this, 0, SpringStates.PAGE)
        }
        return nextNode
    }, Scrollview.prototype.goToPage = function (index) {
        var i, currentIndex = this.getCurrentIndex();
        if (currentIndex > index)for (i = 0; currentIndex - index > i; i++)this.goToPreviousPage();
        if (index > currentIndex)for (i = 0; index - currentIndex > i; i++)this.goToNextPage()
    }, Scrollview.prototype.outputFrom = function () {
        return this._scroller.outputFrom.apply(this._scroller, arguments)
    }, Scrollview.prototype.getPosition = function () {
        return this._particle.getPosition1D()
    }, Scrollview.prototype.getAbsolutePosition = function () {
        return this._scroller.getCumulativeSize(this.getCurrentIndex())[this.options.direction] + this.getPosition()
    }, Scrollview.prototype.getOffset = Scrollview.prototype.getPosition, Scrollview.prototype.setPosition = function (x) {
        this._particle.setPosition1D(x)
    }, Scrollview.prototype.setOffset = Scrollview.prototype.setPosition, Scrollview.prototype.getVelocity = function () {
        return this._touchCount ? this._touchVelocity : this._particle.getVelocity1D()
    }, Scrollview.prototype.setVelocity = function (v) {
        this._particle.setVelocity1D(v)
    }, Scrollview.prototype.setOptions = function (options) {
        void 0 !== options.direction && ("x" === options.direction ? options.direction = Utility.Direction.X : "y" === options.direction && (options.direction = Utility.Direction.Y)), options.groupScroll !== this.options.groupScroll && (options.groupScroll ? this.subscribe(this._scroller) : this.unsubscribe(this._scroller)), this._optionsManager.setOptions(options), this._scroller.setOptions(options), void 0 !== options.drag && this.drag.setOptions({strength: this.options.drag}), void 0 !== options.friction && this.friction.setOptions({strength: this.options.friction}), (void 0 !== options.edgePeriod || void 0 !== options.edgeDamp) && this.spring.setOptions({
            period: this.options.edgePeriod,
            dampingRatio: this.options.edgeDamp
        }), (options.rails || void 0 !== options.direction || void 0 !== options.syncScale || options.preventDefault) && this.sync.setOptions({
            rails: this.options.rails,
            direction: this.options.direction === Utility.Direction.X ? GenericSync.DIRECTION_X : GenericSync.DIRECTION_Y,
            scale: this.options.syncScale,
            preventDefault: this.options.preventDefault
        })
    }, Scrollview.prototype.sequenceFrom = function (node) {
        return node instanceof Array && (node = new ViewSequence({
            array: node,
            trackSize: !0
        })), this._node = node, this._scroller.sequenceFrom(node)
    }, Scrollview.prototype.getSize = function () {
        return this._scroller.getSize.apply(this._scroller, arguments)
    }, Scrollview.prototype.render = function () {
        return this.options.paginated && this._needsPaginationCheck && _handlePagination.call(this), this._scroller.render()
    }, module.exports = Scrollview
}), define("famous/views/GridLayout", ["require", "exports", "module", "../core/Entity", "../core/RenderNode", "../core/Transform", "../core/ViewSequence", "../core/EventHandler", "../core/Modifier", "../core/OptionsManager", "../transitions/Transitionable", "../transitions/TransitionableTransform"], function (require, exports, module) {
    function GridLayout(options) {
        this.options = Object.create(GridLayout.DEFAULT_OPTIONS), this.optionsManager = new OptionsManager(this.options), options && this.setOptions(options), this.id = Entity.register(this), this._modifiers = [], this._states = [], this._contextSizeCache = [0, 0], this._dimensionsCache = [0, 0], this._activeCount = 0, this._eventOutput = new EventHandler, EventHandler.setOutputHandler(this, this._eventOutput)
    }

    function _reflow(size, cols, rows) {
        var usableSize = [size[0], size[1]];
        usableSize[0] -= this.options.gutterSize[0] * (cols - 1), usableSize[1] -= this.options.gutterSize[1] * (rows - 1);
        for (var currX, rowSize = Math.round(usableSize[1] / rows), colSize = Math.round(usableSize[0] / cols), currY = 0, currIndex = 0, i = 0; rows > i; i++) {
            currX = 0;
            for (var j = 0; cols > j; j++)void 0 === this._modifiers[currIndex] ? _createModifier.call(this, currIndex, [colSize, rowSize], [currX, currY, 0], 1) : _animateModifier.call(this, currIndex, [colSize, rowSize], [currX, currY, 0], 1), currIndex++, currX += colSize + this.options.gutterSize[0];
            currY += rowSize + this.options.gutterSize[1]
        }
        for (this._dimensionsCache = [this.options.dimensions[0], this.options.dimensions[1]], this._contextSizeCache = [size[0], size[1]], this._activeCount = rows * cols, i = this._activeCount; i < this._modifiers.length; i++)_animateModifier.call(this, i, [Math.round(colSize), Math.round(rowSize)], [0, 0], 0);
        this._eventOutput.emit("reflow")
    }

    function _createModifier(index, size, position, opacity) {
        var transitionItem = {
            transform: new TransitionableTransform(Transform.translate.apply(null, position)),
            opacity: new Transitionable(opacity),
            size: new Transitionable(size)
        }, modifier = new Modifier({
            transform: transitionItem.transform,
            opacity: transitionItem.opacity,
            size: transitionItem.size
        });
        this._states[index] = transitionItem, this._modifiers[index] = modifier
    }

    function _animateModifier(index, size, position, opacity) {
        var currState = this._states[index], currSize = currState.size, currOpacity = currState.opacity, currTransform = currState.transform, transition = this.options.transition;
        currTransform.halt(), currOpacity.halt(), currSize.halt(), currTransform.setTranslate(position, transition), currSize.set(size, transition), currOpacity.set(opacity, transition)
    }

    var Entity = require("../core/Entity"), Transform = (require("../core/RenderNode"), require("../core/Transform")), ViewSequence = require("../core/ViewSequence"), EventHandler = require("../core/EventHandler"), Modifier = require("../core/Modifier"), OptionsManager = require("../core/OptionsManager"), Transitionable = require("../transitions/Transitionable"), TransitionableTransform = require("../transitions/TransitionableTransform");
    GridLayout.DEFAULT_OPTIONS = {
        dimensions: [1, 1],
        transition: !1,
        gutterSize: [0, 0]
    }, GridLayout.prototype.render = function () {
        return this.id
    }, GridLayout.prototype.setOptions = function (options) {
        return this.optionsManager.setOptions(options)
    }, GridLayout.prototype.sequenceFrom = function (sequence) {
        sequence instanceof Array && (sequence = new ViewSequence(sequence)), this.sequence = sequence
    }, GridLayout.prototype.getSize = function () {
        return this._contextSizeCache
    }, GridLayout.prototype.commit = function (context) {
        var transform = context.transform, opacity = context.opacity, origin = context.origin, size = context.size, cols = this.options.dimensions[0], rows = this.options.dimensions[1];
        (size[0] !== this._contextSizeCache[0] || size[1] !== this._contextSizeCache[1] || cols !== this._dimensionsCache[0] || rows !== this._dimensionsCache[1]) && _reflow.call(this, size, cols, rows);
        for (var sequence = this.sequence, result = [], currIndex = 0; sequence && currIndex < this._modifiers.length;) {
            var item = sequence.get(), modifier = this._modifiers[currIndex];
            currIndex >= this._activeCount && this._states[currIndex].opacity.isActive() && (this._modifiers.splice(currIndex, 1), this._states.splice(currIndex, 1)), item && result.push(modifier.modify({
                origin: origin,
                target: item.render()
            })), sequence = sequence.getNext(), currIndex++
        }
        return size && (transform = Transform.moveThen([-size[0] * origin[0], -size[1] * origin[1], 0], transform)), {
            transform: transform,
            opacity: opacity,
            size: size,
            target: result
        }
    }, module.exports = GridLayout
}), define("views/HeaderView", ["require", "exports", "module", "famous/core/Surface", "famous/core/Modifier", "famous/core/Transform", "famous/core/View"], function (require, exports, module) {
    function HeaderView() {
        View.apply(this, arguments), _createHeader.call(this), _setListeners.call(this)
    }

    function _createHeader() {
        var backgroundSurface = new Surface({size: [void 0, void 0], properties: {backgroundColor: "#FC6E51"}});
        this.hamburgerSurface = new Surface({
            size: [53, void 0],
            content: '<img width="53" src="img/hamburger-template.png"/>'
        }), this.titleSurface = new Surface({
            size: [267, void 0],
            content: "SVET Media Group",
            properties: {fontSize: "22px", textAlign: "center", color: "white", lineHeight: "50px", fontWeight: "700"}
        }), this.hamburgerModifier = new Modifier({transform: Transform.translate(0, 0, 1)}), this.titleModifier = new Modifier({
            origin: [.5, 0],
            align: [.5, 0]
        }), this._add(this.hamburgerModifier).add(this.hamburgerSurface), this._add(this.titleModifier).add(this.titleSurface), this._add(backgroundSurface)
    }

    function _setListeners() {
        this.hamburgerSurface.on("touchstart", function () {
            this.hamburgerModifier.setOpacity(.5)
        }.bind(this)), this.hamburgerSurface.on("mousedown", function () {
            this.hamburgerModifier.setOpacity(.5)
        }.bind(this)), this.hamburgerSurface.on("click", function () {
            this.hamburgerModifier.setOpacity(1), this._eventOutput.emit("menuToggle")
        }.bind(this))
    }

    var Surface = require("famous/core/Surface"), Modifier = require("famous/core/Modifier"), Transform = require("famous/core/Transform"), View = require("famous/core/View");
    HeaderView.prototype = Object.create(View.prototype), HeaderView.prototype.constructor = HeaderView, module.exports = HeaderView
}), define("text", ["module"], function (module) {
    var text, fs, Cc, Ci, xpcIsWindows, progIds = ["Msxml2.XMLHTTP", "Microsoft.XMLHTTP", "Msxml2.XMLHTTP.4.0"], xmlRegExp = /^\s*<\?xml(\s)+version=[\'\"](\d)*.(\d)*[\'\"](\s)*\?>/im, bodyRegExp = /<body[^>]*>\s*([\s\S]+)\s*<\/body>/im, hasLocation = "undefined" != typeof location && location.href, defaultProtocol = hasLocation && location.protocol && location.protocol.replace(/\:/, ""), defaultHostName = hasLocation && location.hostname, defaultPort = hasLocation && (location.port || void 0), buildMap = {}, masterConfig = module.config && module.config() || {};
    return text = {
        version: "2.0.12", strip: function (content) {
            if (content) {
                content = content.replace(xmlRegExp, "");
                var matches = content.match(bodyRegExp);
                matches && (content = matches[1])
            } else content = "";
            return content
        }, jsEscape: function (content) {
            return content.replace(/(['\\])/g, "\\$1").replace(/[\f]/g, "\\f").replace(/[\b]/g, "\\b").replace(/[\n]/g, "\\n").replace(/[\t]/g, "\\t").replace(/[\r]/g, "\\r").replace(/[\u2028]/g, "\\u2028").replace(/[\u2029]/g, "\\u2029")
        }, createXhr: masterConfig.createXhr || function () {
            var xhr, i, progId;
            if ("undefined" != typeof XMLHttpRequest)return new XMLHttpRequest;
            if ("undefined" != typeof ActiveXObject)for (i = 0; 3 > i; i += 1) {
                progId = progIds[i];
                try {
                    xhr = new ActiveXObject(progId)
                } catch (e) {
                }
                if (xhr) {
                    progIds = [progId];
                    break
                }
            }
            return xhr
        }, parseName: function (name) {
            var modName, ext, temp, strip = !1, index = name.indexOf("."), isRelative = 0 === name.indexOf("./") || 0 === name.indexOf("../");
            return -1 !== index && (!isRelative || index > 1) ? (modName = name.substring(0, index), ext = name.substring(index + 1, name.length)) : modName = name, temp = ext || modName, index = temp.indexOf("!"), -1 !== index && (strip = "strip" === temp.substring(index + 1), temp = temp.substring(0, index), ext ? ext = temp : modName = temp), {
                moduleName: modName,
                ext: ext,
                strip: strip
            }
        }, xdRegExp: /^((\w+)\:)?\/\/([^\/\\]+)/, useXhr: function (url, protocol, hostname, port) {
            var uProtocol, uHostName, uPort, match = text.xdRegExp.exec(url);
            return match ? (uProtocol = match[2], uHostName = match[3], uHostName = uHostName.split(":"), uPort = uHostName[1], uHostName = uHostName[0], !(uProtocol && uProtocol !== protocol || uHostName && uHostName.toLowerCase() !== hostname.toLowerCase() || (uPort || uHostName) && uPort !== port)) : !0
        }, finishLoad: function (name, strip, content, onLoad) {
            content = strip ? text.strip(content) : content, masterConfig.isBuild && (buildMap[name] = content), onLoad(content)
        }, load: function (name, req, onLoad, config) {
            if (config && config.isBuild && !config.inlineText)return void onLoad();
            masterConfig.isBuild = config && config.isBuild;
            var parsed = text.parseName(name), nonStripName = parsed.moduleName + (parsed.ext ? "." + parsed.ext : ""), url = req.toUrl(nonStripName), useXhr = masterConfig.useXhr || text.useXhr;
            return 0 === url.indexOf("empty:") ? void onLoad() : void(!hasLocation || useXhr(url, defaultProtocol, defaultHostName, defaultPort) ? text.get(url, function (content) {
                text.finishLoad(name, parsed.strip, content, onLoad)
            }, function (err) {
                onLoad.error && onLoad.error(err)
            }) : req([nonStripName], function (content) {
                text.finishLoad(parsed.moduleName + "." + parsed.ext, parsed.strip, content, onLoad)
            }))
        }, write: function (pluginName, moduleName, write) {
            if (buildMap.hasOwnProperty(moduleName)) {
                var content = text.jsEscape(buildMap[moduleName]);
                write.asModule(pluginName + "!" + moduleName, "define(function () { return '" + content + "';});\n")
            }
        }, writeFile: function (pluginName, moduleName, req, write, config) {
            var parsed = text.parseName(moduleName), extPart = parsed.ext ? "." + parsed.ext : "", nonStripName = parsed.moduleName + extPart, fileName = req.toUrl(parsed.moduleName + extPart) + ".js";
            text.load(nonStripName, req, function () {
                var textWrite = function (contents) {
                    return write(fileName, contents)
                };
                textWrite.asModule = function (moduleName, contents) {
                    return write.asModule(moduleName, fileName, contents)
                }, text.write(pluginName, nonStripName, textWrite, config)
            }, config)
        }
    }, "node" === masterConfig.env || !masterConfig.env && "undefined" != typeof process && process.versions && process.versions.node && !process.versions["node-webkit"] ? (fs = require.nodeRequire("fs"), text.get = function (url, callback, errback) {
        try {
            var file = fs.readFileSync(url, "utf8");
            0 === file.indexOf("﻿") && (file = file.substring(1)), callback(file)
        } catch (e) {
            errback && errback(e)
        }
    }) : "xhr" === masterConfig.env || !masterConfig.env && text.createXhr() ? text.get = function (url, callback, errback, headers) {
        var header, xhr = text.createXhr();
        if (xhr.open("GET", url, !0), headers)for (header in headers)headers.hasOwnProperty(header) && xhr.setRequestHeader(header.toLowerCase(), headers[header]);
        masterConfig.onXhr && masterConfig.onXhr(xhr, url), xhr.onreadystatechange = function () {
            var status, err;
            4 === xhr.readyState && (status = xhr.status || 0, status > 399 && 600 > status ? (err = new Error(url + " HTTP status: " + status), err.xhr = xhr, errback && errback(err)) : callback(xhr.responseText), masterConfig.onXhrComplete && masterConfig.onXhrComplete(xhr, url))
        }, xhr.send(null)
    } : "rhino" === masterConfig.env || !masterConfig.env && "undefined" != typeof Packages && "undefined" != typeof java ? text.get = function (url, callback) {
        var stringBuffer, line, encoding = "utf-8", file = new java.io.File(url), lineSeparator = java.lang.System.getProperty("line.separator"), input = new java.io.BufferedReader(new java.io.InputStreamReader(new java.io.FileInputStream(file), encoding)), content = "";
        try {
            for (stringBuffer = new java.lang.StringBuffer, line = input.readLine(), line && line.length() && 65279 === line.charAt(0) && (line = line.substring(1)), null !== line && stringBuffer.append(line); null !== (line = input.readLine());)stringBuffer.append(lineSeparator), stringBuffer.append(line);
            content = String(stringBuffer.toString())
        } finally {
            input.close()
        }
        callback(content)
    } : ("xpconnect" === masterConfig.env || !masterConfig.env && "undefined" != typeof Components && Components.classes && Components.interfaces) && (Cc = Components.classes, Ci = Components.interfaces, Components.utils["import"]("resource://gre/modules/FileUtils.jsm"), xpcIsWindows = "@mozilla.org/windows-registry-key;1"in Cc, text.get = function (url, callback) {
        var inStream, convertStream, fileObj, readData = {};
        xpcIsWindows && (url = url.replace(/\//g, "\\")), fileObj = new FileUtils.File(url);
        try {
            inStream = Cc["@mozilla.org/network/file-input-stream;1"].createInstance(Ci.nsIFileInputStream), inStream.init(fileObj, 1, 0, !1), convertStream = Cc["@mozilla.org/intl/converter-input-stream;1"].createInstance(Ci.nsIConverterInputStream), convertStream.init(inStream, "utf-8", inStream.available(), Ci.nsIConverterInputStream.DEFAULT_REPLACEMENT_CHARACTER), convertStream.readString(inStream.available(), readData), convertStream.close(), inStream.close(), callback(readData.value)
        } catch (e) {
            throw new Error((fileObj && fileObj.path || "") + ": " + e)
        }
    }), text
}), define("text!jade/homePage.html", [], function () {
    return '\n<section>\n  <article class="svet-media-group">\n    <h2 class="h-services text-center">SVET Russian Media Group</h2>\n    <h3 class="text-center">is the Midwest’s first and oldest publishing and advertising company serving the Russian, Ukrainian and Lithuanian communities since 1990.</h3>\n  </article>\n  <article class="svet-services">\n    <div class="productsServises">\n      <div class="home-icon-container"></div>\n      <h3>SVET<br/>Daily Newspaper</h3>\n      <p>Over 48 pages – circulation 12,000 copies weekly. It is the most up-to-date Russian language newspaper outside of Russia. It appears on the newsstands after 3:00 PM. It is free of charge. In addition, subscribers receive newspapers in their homes via second class mail.</p>\n    </div>\n    <div class="productsServises">\n      <div class="home-icon-container"></div>\n      <h3>Russian-American<br/>Yellow Pages</h3>\n      <p>The Russian Yellow Pages present over 650 full color pages of services and products to the Russian-speaking community in the Chicagoland area. Free distribution in Chicago and its North and Northwestern suburbs.</p>\n    </div>\n    <div class="productsServises">\n      <div class="home-icon-container"></div>\n      <h3>Saturday Plus<br/>Weekly Newspaper</h3>\n      <p>Free Paper with over 48 pages weekly. It covers entertainment and other social news in Unites States and abroad. It packs the latest information on travel destinations and hot vacation spots.</p>\n    </div>\n    <div class="productsServises">\n      <div class="home-icon-container"></div>\n      <h3>Radio<br/>Program “OSA”</h3>\n      <p>Sunday morning talk show with Alex Etman airs every Sunday on 1240 AM radio from 11:00 a.m. to 1:00 p.m. listen to Radio OSA programs.</p>\n    </div>\n  </article>\n</section>'
}), define("views/PageView", ["require", "exports", "module", "famous/core/Surface", "famous/core/Modifier", "famous/core/Transform", "famous/core/View", "famous/views/Scrollview", "famous/views/HeaderFooterLayout", "famous/views/GridLayout", "views/HeaderView", "text!jade/homePage.html"], function (require, exports, module) {
    function PageView() {
        View.apply(this, arguments), this.layout = new HeaderFooterLayout({
            headerSize: 50,
            footerSize: 50
        }), this.header = new HeaderView, this.header.pipe(this), this.contents = [], this.content = new ScrollView, this.contentHome = new Surface({
            size: [void 0, void 0],
            content: homePage,
            properties: {fontSize: "16px", backgroundColor: "#FFFAE2"}
        }), this.contentAbout = new Surface({
            size: [void 0, void 0],
            content: '<h2>SVET International publishing house</h2><p>From the viewpoint of our partners SVET International Publishing House is a typical "company with the past", which basic philosophy is hinged upon well-taken conservatism, weighed approach and clear calculations. It was not for nothing that all previous outside convulsions and crises bypassed our publishing house. Our meticulous attitude towards entering into deals is completely justified by strict performance of undertaken liabilities and flawless financial stability. </p>',
            properties: {backgroundColor: "#E6FFEF"}
        }), this.contentDemographics = new Surface({
            size: [void 0, void 0],
            content: "<h2>Demographics</h2><p>The Russian - American population in the United States is estimated at nearly 2.9 million people</p>",
            properties: {backgroundColor: "#FFFAE2"}
        }), this.contentClients = new Surface({
            size: [void 0, void 0],
            content: "<h2>Demographics</h2><p>The Russian - American population in the United States is estimated at nearly 2.9 million people</p>",
            properties: {backgroundColor: "#E6FFDB"}
        }), this.contentRadio = new Surface({
            size: [void 0, void 0],
            content: "<h2>Radio Program “OSA”</h2><p>Sunday morning talk show with Alex Etman airs every Sunday on 1240 AM radio from 11:00 a.m. to 1:00 p.m.</p>",
            properties: {backgroundColor: "#FFF1E9"}
        }), this.contentContact = new Surface({
            size: [void 0, void 0],
            content: "<h2>Contact Us</h2><p>Sunday morning talk show with Alex Etman airs every Sunday on 1240 AM radio from 11:00 a.m. to 1:00 p.m.</p>",
            properties: {backgroundColor: "#FFE1D0"}
        }), this.contents.push(this.contentHome), this.contents.push(this.contentAbout), this.contents.push(this.contentDemographics), this.contents.push(this.contentClients), this.contents.push(this.contentRadio), this.contents.push(this.contentContact), this.content.sequenceFrom(this.contents), this.contentHome.pipe(this.content), this.contentAbout.pipe(this.content), this.contentDemographics.pipe(this.content), this.contentClients.pipe(this.content), this.contentRadio.pipe(this.content), this.contentContact.pipe(this.content), this.footers = [], this.footer = new GridLayout({dimensions: [3, 1]}), this.footer.pipe(this), this.footerLeft = new Surface({
            size: [void 0, void 0],
            properties: {backgroundColor: "#F27649", backgroundSize: "cover"}
        }), this.footerCenter = new Surface({
            size: [void 0, void 0],
            properties: {backgroundColor: "#D95829", backgroundSize: "cover"}
        }), this.footerRight = new Surface({
            size: [void 0, void 0],
            properties: {backgroundColor: "#F27649", backgroundSize: "cover"}
        }), this.footers.push(this.footerLeft), this.footers.push(this.footerCenter), this.footers.push(this.footerRight), this.footer.sequenceFrom(this.footers), this.layout.content.add(this.content), this.layout.header.add(this.header), this.layout.footer.add(this.footer), this._eventInput.pipe(this._eventOutput), this.add(this.layout)
    }

    var Surface = require("famous/core/Surface"), View = (require("famous/core/Modifier"), require("famous/core/Transform"), require("famous/core/View")), ScrollView = require("famous/views/Scrollview"), HeaderFooterLayout = require("famous/views/HeaderFooterLayout"), GridLayout = require("famous/views/GridLayout"), HeaderView = require("views/HeaderView"), homePage = require("text!jade/homePage.html");
    PageView.prototype = Object.create(View.prototype), PageView.prototype.constructor = PageView, module.exports = PageView
}), define("views/AppView", ["require", "exports", "module", "famous/core/Surface", "famous/core/Modifier", "famous/core/Transform", "famous/core/View", "famous/inputs/MouseSync", "famous/inputs/GenericSync", "famous/transitions/Transitionable", "famous/views/HeaderFooterLayout", "./MenuView", "./PageView"], function (require, exports, module) {
    function AppView() {
        View.apply(this, arguments), this.menuToggle = !1, this.menuView = new MenuView, this.pageView = new PageView, this.pageViewPos = new Transitionable(0), this.pageModifier = new Modifier, this.pageModifier.transformFrom(function () {
            return Transform.translate(this.pageViewPos.get(), 0, 0)
        }.bind(this)), this.pageView.on("menuToggle", this.toggleMenu.bind(this)), this.add(this.menuView), this.add(this.pageModifier).add(this.pageView), _handleTouch.call(this)
    }

    function _handleTouch() {
        GenericSync.register(MouseSync), this.sync = new GenericSync(function () {
            return this.pageViewPos.get(0)
        }.bind(this), {direction: GenericSync.DIRECTION_X}), this.pageView.pipe(this.sync), this.sync.on("update", function (data) {
            0 === this.pageViewPos.get() && data.position > 0 && this.menuView.animateNavItems(), this.pageViewPos.set(Math.min(Math.max(0, data.position), this.options.maxOpenPos))
        }.bind(this)), this.sync.on("end", function (data) {
            {
                var velocity = data.velocity;
                this.pageViewPos.get()
            }
            this.pageViewPos.get() > this.options.posThreshold ? velocity < -this.options.velThreshold ? this.slideLeft() : this.slideRight() : velocity > this.options.velThreshold ? this.slideRight() : this.slideLeft()
        }.bind(this))
    }

    var Modifier = (require("famous/core/Surface"), require("famous/core/Modifier")), Transform = require("famous/core/Transform"), View = require("famous/core/View"), MouseSync = require("famous/inputs/MouseSync"), GenericSync = require("famous/inputs/GenericSync"), Transitionable = require("famous/transitions/Transitionable"), MenuView = (require("famous/views/HeaderFooterLayout"), require("./MenuView")), PageView = require("./PageView");
    AppView.prototype = Object.create(View.prototype), AppView.prototype.constructor = AppView, AppView.DEFAULT_OPTIONS = {
        posThreshold: 95.5,
        velThreshold: .75,
        transition: {duration: 300, curve: "easeOut"},
        maxOpenPos: 191
    }, AppView.prototype.toggleMenu = function () {
        this.menuToggle ? this.slideLeft() : (this.slideRight(), this.menuView.animateNavItems()), this.menuToggle = !this.menuToggle
    }, AppView.prototype.slideLeft = function () {
        this.pageViewPos.set(0, this.options.transition, function () {
            this.menuToggle = !1
        }.bind(this))
    }, AppView.prototype.slideRight = function () {
        this.pageViewPos.set(this.options.maxOpenPos, this.options.transition, function () {
            this.menuToggle = !0
        }.bind(this))
    }, module.exports = AppView
}), define("main", ["require", "famous/core/Engine", "views/AppView"], function (require, Engine, AppView) {
    var mainContext = (require("famous/core/Transform"), Engine.createContext()), appView = new AppView;
    mainContext.add(appView)
}), define("main", function () {
}), define(["require", "famous/core/Engine", "views/AppView"], function (require, Engine, AppView) {
    var mainContext = (require("famous/core/Transform"), Engine.createContext()), appView = new AppView;
    mainContext.add(appView)
}), define(["module"], function (module) {
    "use strict";
    var text, fs, Cc, Ci, xpcIsWindows, progIds = ["Msxml2.XMLHTTP", "Microsoft.XMLHTTP", "Msxml2.XMLHTTP.4.0"], xmlRegExp = /^\s*<\?xml(\s)+version=[\'\"](\d)*.(\d)*[\'\"](\s)*\?>/im, bodyRegExp = /<body[^>]*>\s*([\s\S]+)\s*<\/body>/im, hasLocation = "undefined" != typeof location && location.href, defaultProtocol = hasLocation && location.protocol && location.protocol.replace(/\:/, ""), defaultHostName = hasLocation && location.hostname, defaultPort = hasLocation && (location.port || void 0), buildMap = {}, masterConfig = module.config && module.config() || {};
    return text = {
        version: "2.0.12", strip: function (content) {
            if (content) {
                content = content.replace(xmlRegExp, "");
                var matches = content.match(bodyRegExp);
                matches && (content = matches[1])
            } else content = "";
            return content
        }, jsEscape: function (content) {
            return content.replace(/(['\\])/g, "\\$1").replace(/[\f]/g, "\\f").replace(/[\b]/g, "\\b").replace(/[\n]/g, "\\n").replace(/[\t]/g, "\\t").replace(/[\r]/g, "\\r").replace(/[\u2028]/g, "\\u2028").replace(/[\u2029]/g, "\\u2029")
        }, createXhr: masterConfig.createXhr || function () {
            var xhr, i, progId;
            if ("undefined" != typeof XMLHttpRequest)return new XMLHttpRequest;
            if ("undefined" != typeof ActiveXObject)for (i = 0; 3 > i; i += 1) {
                progId = progIds[i];
                try {
                    xhr = new ActiveXObject(progId)
                } catch (e) {
                }
                if (xhr) {
                    progIds = [progId];
                    break
                }
            }
            return xhr
        }, parseName: function (name) {
            var modName, ext, temp, strip = !1, index = name.indexOf("."), isRelative = 0 === name.indexOf("./") || 0 === name.indexOf("../");
            return -1 !== index && (!isRelative || index > 1) ? (modName = name.substring(0, index), ext = name.substring(index + 1, name.length)) : modName = name, temp = ext || modName, index = temp.indexOf("!"), -1 !== index && (strip = "strip" === temp.substring(index + 1), temp = temp.substring(0, index), ext ? ext = temp : modName = temp), {
                moduleName: modName,
                ext: ext,
                strip: strip
            }
        }, xdRegExp: /^((\w+)\:)?\/\/([^\/\\]+)/, useXhr: function (url, protocol, hostname, port) {
            var uProtocol, uHostName, uPort, match = text.xdRegExp.exec(url);
            return match ? (uProtocol = match[2], uHostName = match[3], uHostName = uHostName.split(":"), uPort = uHostName[1], uHostName = uHostName[0], !(uProtocol && uProtocol !== protocol || uHostName && uHostName.toLowerCase() !== hostname.toLowerCase() || (uPort || uHostName) && uPort !== port)) : !0
        }, finishLoad: function (name, strip, content, onLoad) {
            content = strip ? text.strip(content) : content, masterConfig.isBuild && (buildMap[name] = content), onLoad(content)
        }, load: function (name, req, onLoad, config) {
            if (config && config.isBuild && !config.inlineText)return void onLoad();
            masterConfig.isBuild = config && config.isBuild;
            var parsed = text.parseName(name), nonStripName = parsed.moduleName + (parsed.ext ? "." + parsed.ext : ""), url = req.toUrl(nonStripName), useXhr = masterConfig.useXhr || text.useXhr;
            return 0 === url.indexOf("empty:") ? void onLoad() : void(!hasLocation || useXhr(url, defaultProtocol, defaultHostName, defaultPort) ? text.get(url, function (content) {
                text.finishLoad(name, parsed.strip, content, onLoad)
            }, function (err) {
                onLoad.error && onLoad.error(err)
            }) : req([nonStripName], function (content) {
                text.finishLoad(parsed.moduleName + "." + parsed.ext, parsed.strip, content, onLoad)
            }))
        }, write: function (pluginName, moduleName, write) {
            if (buildMap.hasOwnProperty(moduleName)) {
                var content = text.jsEscape(buildMap[moduleName]);
                write.asModule(pluginName + "!" + moduleName, "define(function () { return '" + content + "';});\n")
            }
        }, writeFile: function (pluginName, moduleName, req, write, config) {
            var parsed = text.parseName(moduleName), extPart = parsed.ext ? "." + parsed.ext : "", nonStripName = parsed.moduleName + extPart, fileName = req.toUrl(parsed.moduleName + extPart) + ".js";
            text.load(nonStripName, req, function () {
                var textWrite = function (contents) {
                    return write(fileName, contents)
                };
                textWrite.asModule = function (moduleName, contents) {
                    return write.asModule(moduleName, fileName, contents)
                }, text.write(pluginName, nonStripName, textWrite, config)
            }, config)
        }
    }, "node" === masterConfig.env || !masterConfig.env && "undefined" != typeof process && process.versions && process.versions.node && !process.versions["node-webkit"] ? (fs = require.nodeRequire("fs"), text.get = function (url, callback, errback) {
        try {
            var file = fs.readFileSync(url, "utf8");
            0 === file.indexOf("﻿") && (file = file.substring(1)), callback(file)
        } catch (e) {
            errback && errback(e)
        }
    }) : "xhr" === masterConfig.env || !masterConfig.env && text.createXhr() ? text.get = function (url, callback, errback, headers) {
        var header, xhr = text.createXhr();
        if (xhr.open("GET", url, !0), headers)for (header in headers)headers.hasOwnProperty(header) && xhr.setRequestHeader(header.toLowerCase(), headers[header]);
        masterConfig.onXhr && masterConfig.onXhr(xhr, url), xhr.onreadystatechange = function () {
            var status, err;
            4 === xhr.readyState && (status = xhr.status || 0, status > 399 && 600 > status ? (err = new Error(url + " HTTP status: " + status), err.xhr = xhr, errback && errback(err)) : callback(xhr.responseText), masterConfig.onXhrComplete && masterConfig.onXhrComplete(xhr, url))
        }, xhr.send(null)
    } : "rhino" === masterConfig.env || !masterConfig.env && "undefined" != typeof Packages && "undefined" != typeof java ? text.get = function (url, callback) {
        var stringBuffer, line, encoding = "utf-8", file = new java.io.File(url), lineSeparator = java.lang.System.getProperty("line.separator"), input = new java.io.BufferedReader(new java.io.InputStreamReader(new java.io.FileInputStream(file), encoding)), content = "";
        try {
            for (stringBuffer = new java.lang.StringBuffer, line = input.readLine(), line && line.length() && 65279 === line.charAt(0) && (line = line.substring(1)), null !== line && stringBuffer.append(line); null !== (line = input.readLine());)stringBuffer.append(lineSeparator), stringBuffer.append(line);
            content = String(stringBuffer.toString())
        } finally {
            input.close()
        }
        callback(content)
    } : ("xpconnect" === masterConfig.env || !masterConfig.env && "undefined" != typeof Components && Components.classes && Components.interfaces) && (Cc = Components.classes, Ci = Components.interfaces, Components.utils["import"]("resource://gre/modules/FileUtils.jsm"), xpcIsWindows = "@mozilla.org/windows-registry-key;1"in Cc, text.get = function (url, callback) {
        var inStream, convertStream, fileObj, readData = {};
        xpcIsWindows && (url = url.replace(/\//g, "\\")), fileObj = new FileUtils.File(url);
        try {
            inStream = Cc["@mozilla.org/network/file-input-stream;1"].createInstance(Ci.nsIFileInputStream), inStream.init(fileObj, 1, 0, !1), convertStream = Cc["@mozilla.org/intl/converter-input-stream;1"].createInstance(Ci.nsIConverterInputStream), convertStream.init(inStream, "utf-8", inStream.available(), Ci.nsIConverterInputStream.DEFAULT_REPLACEMENT_CHARACTER), convertStream.readString(inStream.available(), readData), convertStream.close(), inStream.close(), callback(readData.value)
        } catch (e) {
            throw new Error((fileObj && fileObj.path || "") + ": " + e)
        }
    }), text
}), define(function (require, exports, module) {
    function AppView() {
        View.apply(this, arguments), this.menuToggle = !1, this.menuView = new MenuView, this.pageView = new PageView, this.pageViewPos = new Transitionable(0), this.pageModifier = new Modifier, this.pageModifier.transformFrom(function () {
            return Transform.translate(this.pageViewPos.get(), 0, 0)
        }.bind(this)), this.pageView.on("menuToggle", this.toggleMenu.bind(this)), this.add(this.menuView), this.add(this.pageModifier).add(this.pageView), _handleTouch.call(this)
    }

    function _handleTouch() {
        GenericSync.register(MouseSync), this.sync = new GenericSync(function () {
            return this.pageViewPos.get(0)
        }.bind(this), {direction: GenericSync.DIRECTION_X}), this.pageView.pipe(this.sync), this.sync.on("update", function (data) {
            0 === this.pageViewPos.get() && data.position > 0 && this.menuView.animateNavItems(), this.pageViewPos.set(Math.min(Math.max(0, data.position), this.options.maxOpenPos))
        }.bind(this)), this.sync.on("end", function (data) {
            {
                var velocity = data.velocity;
                this.pageViewPos.get()
            }
            this.pageViewPos.get() > this.options.posThreshold ? velocity < -this.options.velThreshold ? this.slideLeft() : this.slideRight() : velocity > this.options.velThreshold ? this.slideRight() : this.slideLeft()
        }.bind(this))
    }

    var Modifier = (require("famous/core/Surface"), require("famous/core/Modifier")), Transform = require("famous/core/Transform"), View = require("famous/core/View"), MouseSync = require("famous/inputs/MouseSync"), GenericSync = require("famous/inputs/GenericSync"), Transitionable = require("famous/transitions/Transitionable"), MenuView = (require("famous/views/HeaderFooterLayout"), require("./MenuView")), PageView = require("./PageView");
    AppView.prototype = Object.create(View.prototype), AppView.prototype.constructor = AppView, AppView.DEFAULT_OPTIONS = {
        posThreshold: 95.5,
        velThreshold: .75,
        transition: {duration: 300, curve: "easeOut"},
        maxOpenPos: 191
    }, AppView.prototype.toggleMenu = function () {
        this.menuToggle ? this.slideLeft() : (this.slideRight(), this.menuView.animateNavItems()), this.menuToggle = !this.menuToggle
    }, AppView.prototype.slideLeft = function () {
        this.pageViewPos.set(0, this.options.transition, function () {
            this.menuToggle = !1
        }.bind(this))
    }, AppView.prototype.slideRight = function () {
        this.pageViewPos.set(this.options.maxOpenPos, this.options.transition, function () {
            this.menuToggle = !0
        }.bind(this))
    }, module.exports = AppView
}), define(function (require, exports, module) {
    function HeaderView() {
        View.apply(this, arguments), _createHeader.call(this), _setListeners.call(this)
    }

    function _createHeader() {
        var backgroundSurface = new Surface({size: [void 0, void 0], properties: {backgroundColor: "#FC6E51"}});
        this.hamburgerSurface = new Surface({
            size: [53, void 0],
            content: '<img width="53" src="img/hamburger-template.png"/>'
        }), this.titleSurface = new Surface({
            size: [267, void 0],
            content: "SVET Media Group",
            properties: {fontSize: "22px", textAlign: "center", color: "white", lineHeight: "50px", fontWeight: "700"}
        }), this.hamburgerModifier = new Modifier({transform: Transform.translate(0, 0, 1)}), this.titleModifier = new Modifier({
            origin: [.5, 0],
            align: [.5, 0]
        }), this._add(this.hamburgerModifier).add(this.hamburgerSurface), this._add(this.titleModifier).add(this.titleSurface), this._add(backgroundSurface)
    }

    function _setListeners() {
        this.hamburgerSurface.on("touchstart", function () {
            this.hamburgerModifier.setOpacity(.5)
        }.bind(this)), this.hamburgerSurface.on("mousedown", function () {
            this.hamburgerModifier.setOpacity(.5)
        }.bind(this)), this.hamburgerSurface.on("click", function () {
            this.hamburgerModifier.setOpacity(1), this._eventOutput.emit("menuToggle")
        }.bind(this))
    }

    var Surface = require("famous/core/Surface"), Modifier = require("famous/core/Modifier"), Transform = require("famous/core/Transform"), View = require("famous/core/View");
    HeaderView.prototype = Object.create(View.prototype), HeaderView.prototype.constructor = HeaderView, module.exports = HeaderView
}), define(function (require, exports, module) {
    function MenuView() {
        View.apply(this, arguments), _createBacking.call(this), _createNavigationViews.call(this)
    }

    function _createBacking() {
        var backSurface = new Surface({
            size: [this.options.width, this.options.height],
            properties: {backgroundColor: "#595153"}
        });
        this._add(backSurface)
    }

    function _createNavigationViews() {
        this.navModifiers = [];
        for (var navData = [{iconUrl: "img/nav-icons/home.png"}, {iconUrl: "img/nav-icons/about-us.png"}, {iconUrl: "img/nav-icons/demographics.png"}, {iconUrl: "img/nav-icons/clients.png"}, {iconUrl: "img/nav-icons/radio.png"}, {iconUrl: "img/nav-icons/contact-us.png"}], i = 0; i < navData.length; i++) {
            var navView = new NavigationView({
                width: this.options.navWidth,
                height: this.options.navHeight,
                iconUrl: navData[i].iconUrl
            }), yOffset = this.options.topOffset + this.options.navItemOffset * i, navModifier = new Modifier({transform: Transform.translate(0, yOffset, 0)});
            this.navModifiers.push(navModifier), this._add(navModifier).add(navView)
        }
    }

    var Surface = require("famous/core/Surface"), Modifier = require("famous/core/Modifier"), Transform = require("famous/core/Transform"), View = require("famous/core/View"), Timer = require("famous/utilities/Timer"), NavigationView = require("./NavigationView");
    MenuView.prototype = Object.create(View.prototype), MenuView.prototype.constructor = MenuView, MenuView.prototype.resetNavItems = function () {
        for (var i = 0; i < this.navModifiers.length; i++) {
            var initX = -this.options.navWidth / 4, initY = this.options.topOffset + this.options.navItemOffset * i + 2 * this.options.navHeight;
            this.navModifiers[i].setOpacity(0), this.navModifiers[i].setTransform(Transform.translate(initX, initY, 0))
        }
    }, MenuView.prototype.animateNavItems = function () {
        this.resetNavItems();
        for (var i = 0; i < this.navModifiers.length; i++)Timer.setTimeout(function (i) {
            var yOffset = this.options.topOffset + this.options.navItemOffset * i;
            this.navModifiers[i].setOpacity(1, {
                duration: this.options.duration,
                curve: "easeOut"
            }), this.navModifiers[i].setTransform(Transform.translate(0, yOffset, 0), {
                duration: this.options.duration,
                curve: "easeOut"
            })
        }.bind(this, i), i * this.options.staggerDelay)
    }, MenuView.DEFAULT_OPTIONS = {
        navWidth: 191,
        navHeight: 81,
        topOffset: 10,
        navItemOffset: 90,
        duration: 400,
        staggerDelay: 35
    }, module.exports = MenuView
}), define(function (require, exports, module) {
    function NavigationView() {
        View.apply(this, arguments), _createIcon.call(this)
    }

    function _createIcon() {
        var iconSurface = new Surface({content: '<img width="191" src="' + this.options.iconUrl + '"/>'});
        this._add(iconSurface)
    }

    var Surface = require("famous/core/Surface"), View = (require("famous/core/Modifier"), require("famous/core/Transform"), require("famous/core/View"));
    NavigationView.prototype = Object.create(View.prototype), NavigationView.prototype.constructor = NavigationView, NavigationView.DEFAULT_OPTIONS = {
        width: null,
        height: null,
        iconUrl: null
    }, module.exports = NavigationView
}), define(function (require, exports, module) {
    function PageView() {
        View.apply(this, arguments), this.layout = new HeaderFooterLayout({
            headerSize: 50,
            footerSize: 50
        }), this.header = new HeaderView, this.header.pipe(this), this.contents = [], this.content = new ScrollView, this.contentHome = new Surface({
            size: [void 0, void 0],
            content: homePage,
            properties: {fontSize: "16px", backgroundColor: "#FFFAE2"}
        }), this.contentAbout = new Surface({
            size: [void 0, void 0],
            content: '<h2>SVET International publishing house</h2><p>From the viewpoint of our partners SVET International Publishing House is a typical "company with the past", which basic philosophy is hinged upon well-taken conservatism, weighed approach and clear calculations. It was not for nothing that all previous outside convulsions and crises bypassed our publishing house. Our meticulous attitude towards entering into deals is completely justified by strict performance of undertaken liabilities and flawless financial stability. </p>',
            properties: {backgroundColor: "#E6FFEF"}
        }), this.contentDemographics = new Surface({
            size: [void 0, void 0],
            content: "<h2>Demographics</h2><p>The Russian - American population in the United States is estimated at nearly 2.9 million people</p>",
            properties: {backgroundColor: "#FFFAE2"}
        }), this.contentClients = new Surface({
            size: [void 0, void 0],
            content: "<h2>Demographics</h2><p>The Russian - American population in the United States is estimated at nearly 2.9 million people</p>",
            properties: {backgroundColor: "#E6FFDB"}
        }), this.contentRadio = new Surface({
            size: [void 0, void 0],
            content: "<h2>Radio Program “OSA”</h2><p>Sunday morning talk show with Alex Etman airs every Sunday on 1240 AM radio from 11:00 a.m. to 1:00 p.m.</p>",
            properties: {backgroundColor: "#FFF1E9"}
        }), this.contentContact = new Surface({
            size: [void 0, void 0],
            content: "<h2>Contact Us</h2><p>Sunday morning talk show with Alex Etman airs every Sunday on 1240 AM radio from 11:00 a.m. to 1:00 p.m.</p>",
            properties: {backgroundColor: "#FFE1D0"}
        }), this.contents.push(this.contentHome), this.contents.push(this.contentAbout), this.contents.push(this.contentDemographics), this.contents.push(this.contentClients), this.contents.push(this.contentRadio), this.contents.push(this.contentContact), this.content.sequenceFrom(this.contents), this.contentHome.pipe(this.content), this.contentAbout.pipe(this.content), this.contentDemographics.pipe(this.content), this.contentClients.pipe(this.content), this.contentRadio.pipe(this.content), this.contentContact.pipe(this.content), this.footers = [], this.footer = new GridLayout({dimensions: [3, 1]}), this.footer.pipe(this), this.footerLeft = new Surface({
            size: [void 0, void 0],
            properties: {backgroundColor: "#F27649", backgroundSize: "cover"}
        }), this.footerCenter = new Surface({
            size: [void 0, void 0],
            properties: {backgroundColor: "#D95829", backgroundSize: "cover"}
        }), this.footerRight = new Surface({
            size: [void 0, void 0],
            properties: {backgroundColor: "#F27649", backgroundSize: "cover"}
        }), this.footers.push(this.footerLeft), this.footers.push(this.footerCenter), this.footers.push(this.footerRight), this.footer.sequenceFrom(this.footers), this.layout.content.add(this.content), this.layout.header.add(this.header), this.layout.footer.add(this.footer), this._eventInput.pipe(this._eventOutput), this.add(this.layout)
    }

    var Surface = require("famous/core/Surface"), View = (require("famous/core/Modifier"), require("famous/core/Transform"), require("famous/core/View")), ScrollView = require("famous/views/Scrollview"), HeaderFooterLayout = require("famous/views/HeaderFooterLayout"), GridLayout = require("famous/views/GridLayout"), HeaderView = require("views/HeaderView"), homePage = require("text!jade/homePage.html");
    PageView.prototype = Object.create(View.prototype), PageView.prototype.constructor = PageView, module.exports = PageView
});
