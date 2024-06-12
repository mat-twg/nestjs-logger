import {
  ConsoleLogger,
  ConsoleLoggerOptions,
  Inject,
  Injectable,
  Scope,
} from '@nestjs/common';
import { INQUIRER } from '@nestjs/core';
import { clc } from '../../helpers/colors';
import { toBoolean } from '../../helpers/strings';
import * as process from 'process';
import * as util from 'util';

@Injectable({ scope: Scope.TRANSIENT })
export class Logger extends ConsoleLogger {
  private timestamp: number;
  private ctxParams: string[] = [];

  constructor(
    context?: string,
    options?: ConsoleLoggerOptions,
    @Inject(INQUIRER) private readonly parentClass?: object,
  ) {
    super(context || parentClass?.constructor?.name, options);
    this.options.timestamp = this.options?.timestamp ?? true;
  }

  static prefix(): string {
    return (
      clc.green(`[${process?.env?.SERVICE_NAME || 'Nest'}]`) +
      clc.gray(` ${new Date().toISOString()}`)
    );
  }

  setOptions(options: ConsoleLoggerOptions): Logger {
    this.options = options;
    return this;
  }

  setCtxParams(context: string[]): Logger {
    this.ctxParams = context;
    return this;
  }

  resetTimestamp(): Logger {
    this.timestamp = 0;
    return this;
  }

  private ctxWithParams(params: any[]): string {
    const ctx = [this.context, ...this.ctxParams, ...params];
    return clc.yellow(
      ctx
        .filter(Boolean)
        .map((ctx) => `[${ctx}]`)
        .join(''),
    );
  }

  private getTimestampDiff(): number {
    const now = Date.now();
    const diff = this.timestamp > 0 ? now - this.timestamp : 0;
    this.timestamp = now;
    return diff;
  }

  private mapParams(params: any[]): string {
    return this.ctxWithParams(params);
  }

  private warpParams(params: any[]): string {
    if (this.options?.timestamp) {
      params.push(`+${this.getTimestampDiff()}ms`);
    }
    return this.ctxWithParams(params);
  }

  private warpMessage(
    message: any,
    params: any[] = [],
    color?: (text: string) => string,
  ): string[] {
    if (typeof message === 'string') {
      const colorMessage = color ? color(`${message}`) : `${message}`;
      return [
        this.mapParams(params),
        this.options?.timestamp
          ? colorMessage + clc.yellow(` +${this.getTimestampDiff()}ms`)
          : colorMessage,
      ];
    }
    return [this.warpParams(params), util.inspect(message, false, null, true)];
  }

  private pre(level: string): string[] {
    return [Logger.prefix(), level];
  }

  log(message: any, ...optionalParams: any[]) {
    console.log(
      ...this.pre(clc.bold(clc.green('  LOG'))),
      ...this.warpMessage(message, optionalParams),
    );
  }

  info(message: any, ...optionalParams: any[]): void {
    console.info(
      ...this.pre(clc.bold(clc.cyanBright(' INFO'))),
      ...this.warpMessage(message, optionalParams, clc.cyanBright),
    );
  }

  error(message: any, ...optionalParams: any[]) {
    console.error(
      ...this.pre(clc.bold(clc.red('ERROR'))),
      ...this.warpMessage(message, optionalParams, clc.redBright),
    );
  }

  warn(message: any, ...optionalParams: any[]) {
    console.warn(
      ...this.pre(clc.bold(clc.yellow(' WARN'))),
      ...this.warpMessage(message, optionalParams, clc.yellowBright),
    );
  }

  debug(message: any, ...optionalParams: any[]) {
    if (!toBoolean(process?.env?.DEBUG)) {
      return;
    }
    console.debug(
      ...this.pre(clc.bold(clc.magentaBright('DEBUG'))),
      ...this.warpMessage(message, optionalParams, clc.magentaBright),
    );
  }

  verbose(message: any, ...optionalParams: any[]) {
    console.log(
      ...this.pre(clc.bold(clc.cyanBright('VERBOSE'))),
      this.warpMessage(message, optionalParams),
    );
  }

  custom(level: string, message: any, ...optionalParams: any[]) {
    console.log(
      ...this.pre(clc.bold(level)),
      this.warpMessage(message, optionalParams),
    );
  }
}
