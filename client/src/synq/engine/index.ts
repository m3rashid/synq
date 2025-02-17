import { ModelSchemaDefault } from '@/synq/models/base';
import { DataLayerConstructorParams } from '@/synq/storage/types';
import { IndexedDbDataLayer } from '../storage';

const SYNC_INTERVAL = 1000; // 1 second

export class Engine {
  dbName: string;
  private syncInterval: number;

  dataLayers: {
    [tableName: string]: IndexedDbDataLayer<ModelSchemaDefault>;
  } = {};

  constructor(dbName: string, dataLayerParamsArr?: Array<DataLayerConstructorParams<ModelSchemaDefault>>) {
    this.dbName = dbName;
    this.syncInterval = window.setInterval(this.syncData, SYNC_INTERVAL);

    if (dataLayerParamsArr && dataLayerParamsArr.length > 0) {
      for (const dataLayer of dataLayerParamsArr) this.registerDataLayer(dataLayer);
    }
  }

  registerDataLayer(dataLayerParams: DataLayerConstructorParams<ModelSchemaDefault>) {
    if (this.dataLayers[dataLayerParams.tableName]) {
      throw new Error(`DataLayer ${dataLayerParams.tableName} already exists`);
    }

    this.dataLayers[dataLayerParams.tableName] = new IndexedDbDataLayer(dataLayerParams);
  }

  syncData() {
    console.log('Syncing data...');
    // TODO
  }
}
