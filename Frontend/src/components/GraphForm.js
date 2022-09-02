import React, { Component, useEffect, useRef } from 'react';
import { Form, Button, FormGroup, Input, Label, Row, Col, InputGroup } from 'reactstrap';

export function GraphParamControl(props) {
    return (
        <Form bsSize="sm">
            <FormGroup row>
                <Label for='nodesCount' sm={4} size='sm' >
                    Количество нод
                </Label>
                <Col sm={8}>
                    <Input
                        value={props.nodesCount}
                        id="nodesCount"
                        name="nodesCount"
                        onChange={props.handleInputBind}
                        size='sm'
                    />
                </Col>
            </FormGroup>
            <FormGroup row>
                <Label for='minLinks' sm={4} size='sm' >
                    Связи, c
                </Label>
                <Col sm={8}>
                    <Input
                        value={props.minLinks}
                        id="minLinks"
                        name="minLinks"
                        onChange={props.handleInputBind}
                    />
                </Col>
            </FormGroup>
            <FormGroup row>
                <Label for='maxLinks' sm={4} size='sm' >
                    Связи, по
                </Label>
                <Col sm={8}>
                    <Input
                        value={props.maxLinks}
                        name="maxLinks"
                        id="maxLinks"
                        onChange={props.handleInputBind}
                    />
                </Col>
            </FormGroup>
            <FormGroup row>
                <Col className="d-grid gap-2">
                    <Button color="primary" size='sm' onClick={props.getNewGraphBind}>
                        Сгенерировать
                    </Button>
                </Col>
            </FormGroup>
        </Form>
    );
}

export function GraphOrderControl({ name, value, label, ...props }) {
    return (
        <InputGroup>
            <label htmlFor={name} className="form-label">{label}: {value}</label>
            <Input value={value}
                name={name}
                type="range"
                min="0"
                id={name}
                {...props} />
        </InputGroup>
    );
}