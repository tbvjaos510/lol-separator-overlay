// @ts-ignore
import memoryJs from 'memoryjs';
import { DataType } from 'src/riot-api/utils/datatype';

export class ProcessAPI {
  private static readonly PROCESS_NAME =
    'League of Legends.exe';
  private process?: {
    dwSize: number;
    th32ProcessID: number;
    cntThreads: number;
    th32ParentProcessID: number;
    pcPriClassBase: number;
    szExeFile: string;
    modBaseAddr: number;
    handle: number;
  };

  public openProcess() {
    this.process = memoryJs.openProcess(
      ProcessAPI.PROCESS_NAME,
    );

    const module = memoryJs.findModule(
      ProcessAPI.PROCESS_NAME,
      this.process!.th32ProcessID,
    );

    this.process!.modBaseAddr = module.modBaseAddr;

    console.log(this.process);
  }

  public closeProcess() {
    if (this.process) {
      memoryJs.closeProcess(this.process.th32ProcessID);
    }
  }

  public readBuffer(
    offset: number,
    size: number,
    fromBase = false,
  ): Buffer {
    if (!this.process) {
      throw new Error('Process is not open');
    }
    return memoryJs.readBuffer(
      this.process.handle,
      (fromBase ? this.process.modBaseAddr : 0) + offset,
      size,
    );
  }

  public read(
    ptr: number,
    type: DataType,
    fromBase = false,
  ): any {
    if (!this.process) {
      throw new Error('Process is not open');
    }

    return memoryJs.readMemory(
      this.process.handle,
      (fromBase ? this.process.modBaseAddr : 0) + ptr,
      type,
    );
  }
}
